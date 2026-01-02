/**
 * QVET API Client
 * Cliente reutilizable para autenticación y descarga de reportes desde QVET
 */

import axios, { AxiosInstance } from 'axios';
import fs from 'fs';
import path from 'path';
import { randomBytes } from 'crypto';

// Generar UUID v4
function uuidv4(): string {
  const bytes = randomBytes(16);
  bytes[6] = (bytes[6]! & 0x0f) | 0x40;
  bytes[8] = (bytes[8]! & 0x3f) | 0x80;
  const hex = bytes.toString('hex');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20, 32)}`;
}

// Configuración desde variables de entorno
const QVET_USER = process.env.QVET_USER || 'JAVIERH';
const QVET_PASS = process.env.QVET_PASS || 'Victorhug0.-';
const QVET_AUTO = process.env.QVET_AUTO || 'HVPENINSULARSC';

interface QVETSession {
  client: AxiosInstance;
  sessionId?: string;
  baseUrl?: string;
  idsr?: string;
  idForm?: string;
}

interface CachedSession {
  sessionId: string;
  baseUrl: string;
  idForm: string;
  idsr: string;
  cookies: string;
  timestamp: number;
  expiresAt: number;
}

// Crear estructura de carpetas para QVET
function ensureQVETFolders() {
  const baseDir = path.join(process.cwd(), 'data', 'qvet');
  const folders = ['reports', 'logs'];

  folders.forEach(folder => {
    const folderPath = path.join(baseDir, folder);
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }
  });

  return {
    reports: path.join(baseDir, 'reports'),
    logs: path.join(baseDir, 'logs'),
  };
}

function getSessionCachePath(): string {
  const folders = ensureQVETFolders();
  return path.join(folders.logs, 'session-cache.json');
}

function saveSessionCache(session: QVETSession): void {
  if (!session.sessionId || !session.baseUrl || !session.idForm || !session.idsr) {
    return;
  }

  const cachePath = getSessionCachePath();
  const now = Date.now();
  const cache: CachedSession = {
    sessionId: session.sessionId,
    baseUrl: session.baseUrl,
    idForm: session.idForm,
    idsr: session.idsr,
    cookies: session.client.defaults.headers.Cookie as string || '',
    timestamp: now,
    expiresAt: now + (20 * 60 * 1000), // 20 minutos
  };

  try {
    fs.writeFileSync(cachePath, JSON.stringify(cache, null, 2));
    console.log('💾 Sesión guardada en caché (válida por 20 minutos)');
  } catch (err) {
    console.log('⚠️  No se pudo guardar la sesión en caché');
  }
}

function loadSessionCache(): CachedSession | null {
  const cachePath = getSessionCachePath();

  if (!fs.existsSync(cachePath)) {
    return null;
  }

  try {
    const content = fs.readFileSync(cachePath, 'utf-8');
    const cache: CachedSession = JSON.parse(content);

    if (Date.now() > cache.expiresAt) {
      console.log('⏰ Sesión en caché expiró');
      fs.unlinkSync(cachePath);
      return null;
    }

    const minutesLeft = Math.floor((cache.expiresAt - Date.now()) / 60000);
    console.log(`📦 Sesión en caché válida (${minutesLeft} min restantes)`);
    return cache;
  } catch (err) {
    console.log('⚠️  Error leyendo caché de sesión');
    return null;
  }
}

async function createSession(): Promise<QVETSession> {
  const client = axios.create({
    headers: {
      'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36',
      'Accept-Language': 'en-US,en;q=0.9',
    },
    validateStatus: () => true,
    maxRedirects: 0,
  });

  return { client };
}

async function validateCachedSession(session: QVETSession): Promise<boolean> {
  const { client, baseUrl } = session;

  try {
    const resp = await client.get(`${baseUrl}/Home/Index`, {
      headers: { 'Accept': 'text/html' },
      timeout: 5000,
    });

    if (resp.status === 200) {
      console.log('✅ Sesión en caché válida');
      return true;
    }

    return false;
  } catch (err) {
    return false;
  }
}

async function login(session: QVETSession): Promise<boolean> {
  const { client } = session;

  try {
    console.log('🔐 Iniciando autenticación QVET...');

    // 1. Verificar SAML
    await client.post(
      'https://go.qvet.net/Home/EsSAML',
      { clinica: QVET_AUTO },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
      }
    );

    // 2. Verificar usuario
    await client.post(
      'https://go.qvet.net/Home/EsUserQvetAndSAML',
      { clinica: QVET_AUTO, user: QVET_USER },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
      }
    );

    // 3. Login inicial
    const loginResp = await client.post(
      'https://go.qvet.net/Home/DoLogin',
      {
        NombreClinica: QVET_AUTO,
        UserName: QVET_USER,
        Pwd: QVET_PASS,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
      }
    );

    if (loginResp.data && (loginResp.data.Url || loginResp.data.URL)) {
      const redirectUrl = loginResp.data.Url || loginResp.data.URL;
      session.baseUrl = redirectUrl.startsWith('http') ? new URL(redirectUrl).origin : redirectUrl;
      console.log(`   ✅ Servidor: ${session.baseUrl}`);
    } else {
      console.log('   ⚠️  No se obtuvo URL de servidor');
      return false;
    }

    // 4. AutoLogin
    const equipoName = `Equipo_${Math.random().toString(36).substring(7)}`;
    const autoLoginParams = new URLSearchParams({
      NombreEquipo: equipoName,
      BD: '',
      Servidor: '',
      Pais: '',
      FlagFree4Vet: 'False',
      EmailFree4Vet: 'False',
      ResetPasswordF4V: 'False',
      Free4Vet: 'False',
      EmailMensajeVisible: 'False',
      Clinica: QVET_AUTO,
      UserName: QVET_USER,
      Password: QVET_PASS,
      IdCentro: '',
      RedirectTo: '/',
    });

    await client.post(
      `${session.baseUrl}/Login/AutoLogin`,
      autoLoginParams.toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        maxRedirects: 0,
      }
    );

    // 5. Comprobar Usuario (sin centro)
    const idsrValue = uuidv4();
    session.idsr = idsrValue;

    const comprobarResp1 = await client.post(
      `${session.baseUrl}/Login/ComprobarUsuario`,
      {
        model: {
          NombreEquipo: equipoName,
          AutoLogin: 'True',
          Clinica: QVET_AUTO,
          UserName: QVET_USER,
          Password: QVET_PASS,
          IdCentro: '',
          RedirectTo: '/Home/Index',
        },
        NombreEquipo: '',
        DireccionMAC: '',
        QVetWS: false,
        TipoDispositivoWeb: 0,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
      }
    );

    if (comprobarResp1.data && comprobarResp1.data.SessionId) {
      session.sessionId = comprobarResp1.data.SessionId;
      console.log(`   ✅ Session ID obtenido`);
    }

    // 6. Comprobar Usuario (con centro)
    const idCentro = '1';

    await client.post(
      `${session.baseUrl}/Login/ComprobarUsuario`,
      {
        model: {
          NombreEquipo: equipoName,
          AutoLogin: 'True',
          Clinica: QVET_AUTO,
          UserName: QVET_USER,
          Password: QVET_PASS,
          IdCentro: idCentro,
          RedirectTo: '/Home/Index',
        },
        NombreEquipo: '',
        DireccionMAC: '',
        QVetWS: false,
        TipoDispositivoWeb: 0,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          'Cookie': `ASP.NET_SessionId=${session.sessionId}`,
        },
      }
    );

    // 7. Inicializar sesión
    const initRequests = [
      { url: '/Helper/NotificarActualizacion', data: {} },
      { url: '/Asincrono/Ping', data: 'firstTime=true', contentType: 'application/x-www-form-urlencoded' },
      { url: '/Helper/GetParametros', data: 'Refrescar=0', contentType: 'application/x-www-form-urlencoded' },
      { url: '/Asincrono/AsignarIdentificadorConexion', data: `Id=${idsrValue}`, contentType: 'application/x-www-form-urlencoded' },
    ];

    for (const req of initRequests) {
      await client.post(`${session.baseUrl}${req.url}`, req.data, {
        headers: {
          'Content-Type': req.contentType || 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          'Cookie': `ASP.NET_SessionId=${session.sessionId}`,
        },
      }).catch(() => {});
    }

    console.log('   ✅ Autenticación completada');
    return true;

  } catch (error: any) {
    console.error('❌ Error en login:', error.message);
    return false;
  }
}

async function navigateToReports(session: QVETSession): Promise<boolean> {
  const { client, baseUrl, sessionId, idsr } = session;

  if (!baseUrl || !sessionId || !idsr) {
    console.log('❌ Sesión no válida');
    return false;
  }

  try {
    console.log('📁 Navegando a Listados...');

    const listadosResp = await client.get(
      `${baseUrl}/Listados/Listados?_=${Date.now()}`,
      {
        headers: {
          'Accept': 'text/html, */*; q=0.01',
          'X-Requested-With': 'XMLHttpRequest',
          'Cookie': `ASP.NET_SessionId=${sessionId}`,
          'Referer': `${baseUrl}/Home/Index`,
          'idsr': idsr,
        },
      }
    );

    if (listadosResp.status !== 200) {
      console.log('   ⚠️  Error al cargar Listados');
      return false;
    }

    // Extraer IdForm del HTML
    const html = listadosResp.data;
    const idFormMatch = html.match(/id="([a-f0-9]{32})"/);
    if (idFormMatch) {
      session.idForm = idFormMatch[1];
      console.log(`   ✅ IdForm obtenido`);
    } else {
      session.idForm = 'f907bd3c90330c9d9558deed6790d92b';
    }

    return true;

  } catch (error: any) {
    console.error('❌ Error navegando a reportes:', error.message);
    return false;
  }
}

async function downloadReport(
  session: QVETSession,
  reportId: string,
  reportName: string
): Promise<string | null> {
  const { client, baseUrl, sessionId, idsr, idForm } = session;

  if (!baseUrl || !sessionId || !idsr || !idForm) {
    console.log('❌ Sesión no válida');
    return null;
  }

  try {
    console.log(`📊 Descargando reporte ${reportName} (ID: ${reportId})...`);

    // 1. Obtener parámetros del reporte
    const paramsResp = await client.post(
      `${baseUrl}/Listados/GridListados`,
      `sort=&group=&filter=&IdListado=${reportId}`,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          'X-Requested-With': 'XMLHttpRequest',
          'Cookie': `ASP.NET_SessionId=${sessionId}`,
          'idsr': idsr,
          'currentview': idForm,
        },
      }
    );

    let parametrosLista: any[] = [];
    if (paramsResp.data && Array.isArray(paramsResp.data.Data)) {
      parametrosLista = paramsResp.data.Data;
      if (parametrosLista.length > 0) {
        console.log(`   ℹ️  Reporte tiene ${parametrosLista.length} parámetros (usando valores por defecto)`);
      }
    }

    // 2. Exportar listado
    const exportResp = await client.post(
      `${baseUrl}/Listados/ExportarListado`,
      {
        IdListado: reportId,
        Parametros: JSON.stringify(parametrosLista),
        IdForm: idForm,
        TipoListado: 'Listado',
        FechaIni: null,
        FechaFin: null,
        ParametrosLista: parametrosLista,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          'Cookie': `ASP.NET_SessionId=${sessionId}`,
          'idsr': idsr,
          'currentview': idForm,
        },
      }
    );

    if (exportResp.status !== 200) {
      console.log('   ⚠️  Error al exportar listado');
      return null;
    }

    const fileName = typeof exportResp.data === 'string'
      ? exportResp.data.replace(/"/g, '')
      : exportResp.data?.NombreArchivo || exportResp.data;

    console.log(`   ✅ Archivo generado en servidor`);

    // 3. Descargar archivo
    const downloadResp = await client.get(
      `${baseUrl}/Listados/ObtenerExcelExportado`,
      {
        params: { NombreListado: fileName },
        headers: {
          'Cookie': `ASP.NET_SessionId=${sessionId}`,
        },
        responseType: 'arraybuffer',
      }
    );

    if (downloadResp.status !== 200 || downloadResp.data.byteLength === 0) {
      console.log('   ⚠️  Error al descargar archivo');
      return null;
    }

    // 4. Guardar archivo
    const folders = ensureQVETFolders();
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0];
    const destPath = path.join(folders.reports, `${reportName}-${timestamp}.xlsx`);

    fs.writeFileSync(destPath, new Uint8Array(downloadResp.data));

    const fileSizeKB = (fs.statSync(destPath).size / 1024).toFixed(2);
    console.log(`✅ Reporte descargado: ${destPath} (${fileSizeKB} KB)`);

    return destPath;

  } catch (error: any) {
    console.error('❌ Error descargando reporte:', error.message);
    return null;
  }
}

export async function downloadQvetReport(
  reportId: string,
  reportName: string
): Promise<string> {
  // Intentar cargar sesión del caché
  const cached = loadSessionCache();
  let session: QVETSession;

  if (cached) {
    console.log('🔄 Intentando usar sesión en caché...');
    session = await createSession();
    session.sessionId = cached.sessionId;
    session.baseUrl = cached.baseUrl;
    session.idForm = cached.idForm;
    session.idsr = cached.idsr;
    session.client.defaults.headers.Cookie = cached.cookies;

    const isValid = await validateCachedSession(session);

    if (!isValid) {
      console.log('🔐 Sesión expiró, haciendo login completo...');
      session = await createSession();
      const success = await login(session);
      if (!success) {
        throw new Error('Login falló');
      }
      await navigateToReports(session);
      saveSessionCache(session);
    }
  } else {
    session = await createSession();
    const success = await login(session);
    if (!success) {
      throw new Error('Login falló');
    }
    await navigateToReports(session);
    saveSessionCache(session);
  }

  const filePath = await downloadReport(session, reportId, reportName);

  if (!filePath) {
    throw new Error('No se pudo descargar el reporte');
  }

  return filePath;
}

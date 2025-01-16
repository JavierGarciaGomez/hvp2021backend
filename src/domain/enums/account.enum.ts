// export enum AccountClass {
//   Activo = "Activo",
//   Pasivo = "Pasivo",
//   Patrimonio = "Patrimonio",
//   Ingresos = "Ingresos",
//   Egresos = "Egresos",
// }

// export enum AccountType {
//   ActivoFijo = "Activo fijo",
//   ActivoCirculante = "Activo circulante",
//   PasivoCirculante = "Pasivo circulante",
//   PasivoNoCirculante = "Pasivo no circulante",
//   PatrimonioReservas = "Reservas",
//   PatrimonioResultadosDelEjercicio = "Resultados del ejercicio",
//   PatrimonioUtilidadesRetenidas = "Utilidades retenidas",
//   PatrimonioResultadosAcumulados = "Resultados acumulados",
//   PatrimonioAportacionesAdicionalesDeLosSocios = "Aportaciones adicionales de los socios",
//   PatrimonioDividendosPorPagar = "Dividendos por pagar",
//   IngresosOperativos = "Ingresos operativos",
//   IngresosOtrosIngresos = "Otros ingresos",
//   EgresosOperativos = "Egresos operativos",
//   EgresosNoOperativos = "Egresos no operativos",
// }

// export enum AccountSubtype {
//   // Activo fijo
//   Equipamiento = "Equipamiento",
//   Inmuebles = "Inmuebles",
//   Vehiculos = "Vehículos",
//   OtroActivoFijo = "Otro activo fijo",

//   // Activo circulante
//   EfectivoYEquivalentes = "Efectivo y equivalentes",
//   Inventario = "Inventario",
//   CuentasPorCobrar = "Cuentas por cobrar",
//   AnticiposAProveedores = "Anticipos a proveedores",

//   // Pasivo circulante
//   CuentasPorPagar = "Cuentas por pagar",
//   ContribucionesFiscalesPorPagar = "Contribuciones fiscales por pagar",
//   AportacionesSeguridadSocialPorPagar = "Aportaciones de la seguridad social por pagar",
//   AcreedoresDiversos = "Acreedores diversos",
//   AnticiposRecibidos = "Anticipos recibidos",
//   PrestamosACortoPlazo = "Préstamos a corto plazo",
//   ProvisionesACortoPlazo = "Provisiones a corto plazo",

//   // Pasivo no circulante
//   PrestamosALargoPlazo = "Préstamos a largo plazo",
//   AcreedoresHipotecarios = "Acreedores hipotecarios",
//   ArrendamientosFinancieros = "Arrendamientos financieros",
//   ObligacionesConSociosInversionistas = "Obligaciones con los socios inversionistas",

//   // Patrimonio
//   ReservaLegal = "Reserva legal",
//   ReservaEstatutaria = "Reserva estatutaria",
//   ReservaParaContingencia = "Reserva para contingencia",
//   ReservaDeInversion = "Reserva de inversión",
//   UtilidadesRetenidasEjerciciosAnteriores = "Utilidades retenidas de ejercicios anteriores",
//   UtilidadesRetenidasEjercicioActual = "Utilidades retenidas del ejercicio actual",

//   // Ingresos operativos
//   IngresosGenerales = "Ingresos generales",

//   // Otros ingresos
//   IngresosFinancieros = "Ingresos financieros",
//   IngresosPorVentasDeActivosNoCorrientes = "Ingresos por ventas de activos no corrientes",
//   OtrosIngresos = "Otros ingresos",

//   // Egresos operativos
//   CostoDeVentas = "Costo de ventas",
//   GastosDelPersonal = "Gastos del personal",
//   GastosOperativosFijos = "Gastos operativos fijos",
//   GastosOperativosVariables = "Gastos operativos variables",

//   // Egresos no operativos
//   ContribucionesFiscales = "Contribuciones fiscales",
//   Contingencias = "Contingencias",
//   Otros = "Otros",
// }

export type AccountSubtype = {
  name: string;
  code: string;
};

export type AccountType = {
  name: string;
  code: string;
  subtypes: Record<string, AccountSubtype>;
};

export type AccountClass = {
  name: string;
  code: string;
  types: Record<string, AccountType>;
};

export type AccountClassificationType = Record<string, AccountClass>;

export const AccountClassification: AccountClassificationType = {
  assets: {
    name: "Activo",
    code: "01",
    types: {
      fixedAssets: {
        name: "Activo fijo",
        code: "01.01",
        subtypes: {
          equipment: { name: "Equipamiento", code: "01.01.01" },
          realEstate: { name: "Inmuebles", code: "01.01.02" },
          vehicles: { name: "Vehículos", code: "01.01.03" },
          otherFixedAssets: { name: "Otro activo fijo", code: "01.01.04" },
        },
      },
      currentAssets: {
        name: "Activo circulante",
        code: "01.02",
        subtypes: {
          cashAndEquivalents: {
            name: "Efectivo y equivalentes",
            code: "01.02.01",
          },
          inventory: { name: "Inventario", code: "01.02.02" },
          accountsReceivable: { name: "Cuentas por cobrar", code: "01.02.03" },
          advancesToSuppliers: {
            name: "Anticipos a proveedores",
            code: "01.02.04",
          },
        },
      },
    },
  },
  liabilities: {
    name: "Pasivo",
    code: "02",
    types: {
      currentLiabilities: {
        name: "Pasivo circulante",
        code: "02.01",
        subtypes: {
          accountsPayable: { name: "Cuentas por pagar", code: "02.01.01" },
          taxContributionsPayable: {
            name: "Contribuciones fiscales por pagar",
            code: "02.01.02",
          },
          socialSecurityContributionsPayable: {
            name: "Aportaciones de la seguridad social por pagar",
            code: "02.01.03",
          },
          miscellaneousCreditors: {
            name: "Acreedores diversos",
            code: "02.01.04",
          },
          advancesReceived: { name: "Anticipos recibidos", code: "02.01.05" },
          shortTermLoans: { name: "Préstamos a corto plazo", code: "02.01.06" },
          shortTermProvisions: {
            name: "Provisiones a corto plazo",
            code: "02.01.07",
          },
        },
      },
      nonCurrentLiabilities: {
        name: "Pasivo no circulante",
        code: "02.02",
        subtypes: {
          longTermLoans: { name: "Préstamos a largo plazo", code: "02.02.01" },
          mortgageCreditors: {
            name: "Acreedores hipotecarios",
            code: "02.02.02",
          },
          financialLeases: {
            name: "Arrendamientos financieros",
            code: "02.02.03",
          },
          investorObligations: {
            name: "Obligaciones con los socios inversionistas",
            code: "02.02.04",
          },
        },
      },
    },
  },
  equity: {
    name: "Patrimonio",
    code: "03",
    types: {
      reserves: {
        name: "Reservas",
        code: "03.01",
        subtypes: {
          legalReserve: { name: "Reserva legal", code: "03.01.01" },
          statutoryReserve: { name: "Reserva estatutaria", code: "03.01.02" },
          contingencyReserve: {
            name: "Reserva para contingencia",
            code: "03.01.03",
          },
          investmentReserve: { name: "Reserva de inversión", code: "03.01.04" },
        },
      },
      retainedEarnings: {
        name: "Utilidades retenidas",
        code: "03.02",
        subtypes: {
          previousPeriods: {
            name: "Utilidades retenidas de ejercicios anteriores",
            code: "03.02.01",
          },
          currentPeriod: {
            name: "Utilidades retenidas del ejercicio actual",
            code: "03.02.02",
          },
        },
      },
    },
  },
  income: {
    name: "Ingresos",
    code: "04",
    types: {
      operatingIncome: {
        name: "Ingresos operativos",
        code: "04.01",
        subtypes: {
          generalIncome: { name: "Ingresos generales", code: "04.01.01" },
        },
      },
      otherIncome: {
        name: "Otros ingresos",
        code: "04.02",
        subtypes: {
          financialIncome: { name: "Ingresos financieros", code: "04.02.01" },
          saleOfAssets: {
            name: "Ingresos por ventas de activos no corrientes",
            code: "04.02.02",
          },
          otherIncome: { name: "Otros ingresos", code: "04.02.03" },
        },
      },
    },
  },
  expenses: {
    name: "Egresos",
    code: "05",
    types: {
      operatingExpenses: {
        name: "Egresos operativos",
        code: "05.01",
        subtypes: {
          costOfSales: { name: "Costo de ventas", code: "05.01.01" },
          personnelExpenses: { name: "Gastos del personal", code: "05.01.02" },
          fixedOperatingExpenses: {
            name: "Gastos operativos fijos",
            code: "05.01.03",
          },
          variableOperatingExpenses: {
            name: "Gastos operativos variables",
            code: "05.01.04",
          },
        },
      },
      nonOperatingExpenses: {
        name: "Egresos no operativos",
        code: "05.02",
        subtypes: {
          taxContributions: {
            name: "Contribuciones fiscales",
            code: "05.02.01",
          },
          contingencies: { name: "Contingencias", code: "05.02.02" },
          others: { name: "Otros", code: "05.02.03" },
        },
      },
    },
  },
} as const;

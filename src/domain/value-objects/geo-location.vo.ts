export interface GeoLocationVO {
  latitude: number;
  longitude: number;
}

export const GeoLocationSchema = {
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
};

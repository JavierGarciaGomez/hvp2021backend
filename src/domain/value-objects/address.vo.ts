export interface AddressVO {
  line1: string;
  line2: string;
  city: string;
  state: string;
  country: string;
  zip: string;
}

export const AddressSchema = {
  line1: { type: String, required: false },
  line2: { type: String, required: false },
  city: { type: String, required: false },
  state: { type: String, required: false },
  country: { type: String, required: false },
  zip: { type: String, required: false },
};

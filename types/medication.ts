export interface IDrugInfo {
  drugbank_pcid: string
  name: string
  hit: string
  display_name?: string
  type?: string
}

export interface RxDrugDetail {
  rxcui: string
  name: string
  full_name: string
  rxnorm_dose_form: string
  route: string
}

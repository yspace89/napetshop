export interface User {
  id: string
  name: string
  email: string
  role: string
}

export interface Branch {
  id: string
  name: string
  location: string
}

export interface Product {
  id: string
  sku: string
  name: string
  category: string
  base_price: number
}

export interface PriceOverride {
  id: string
  user_id: string
  branch_id: string
  product_id: string
  custom_price: number
  updated_at: string
}

export interface ProductWithPrice extends Product {
  custom_price?: number
  effective_price: number
}

export interface EducationSession {
  id: string
  advisor_id: string
  branch_id: string
  client_name: string
  client_wa: string
  pet_type: 'Kucing' | 'Anjing'
  created_at: string
  photo?: string
  photo_location?: string
  photo_timestamp?: string
  branch?: Branch
  items?: EducationItem[]
}

export interface EducationItem {
  id: string
  session_id: string
  product_id: string
  purchase_status: 'pending' | 'purchased'
  actual_price: number | null
  updated_at: string
  product?: Product
}

export interface KpiTarget {
  id: string
  advisor_id: string
  month: string
  edu_target: number
  sales_target: number
}

export interface KpiSummary {
  edu_count: number
  edu_target: number
  sales_qty: number
  sales_total: number
  sales_target: number
}

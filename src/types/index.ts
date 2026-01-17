export interface IBusinessType {
  _id?: string
  name: string
  description?: string
  is_active: boolean
  created_at?: Date
}

export interface IBusiness {
  _id?: string
  business_type_id: string
  business_name: string
  owner_name: string
  phone_number: string
  address: string
  city: string
  is_active: boolean
  created_at?: Date
  waba_id: string
  phone_number_id: string
  phone_number_display?: string
  access_token?: string
}

export interface ICustomer {
  _id?: string
  business_id: string
  name: string
  phone_number: string
  email?: string
  address?: string
  is_active: boolean
  created_at?: Date
}

export interface IVehicle {
  _id?: string
  customer_id: string
  vehicle_type: string
  brand: string
  vehicle_model: string
  registration_number: string
  year: number
  created_at?: Date
}

export interface IService {
  _id?: string
  vehicle_id: string
  last_service_date: Date
  next_service_date: Date
  service_interval_days: number
  notes?: string
  created_at?: Date
}

export interface IReminder {
  _id?: string
  service_id: string
  scheduled_for: Date
  status: string
  retry_count: number
  last_attempt_at?: Date
  created_at?: Date
}

export interface IWhatsAppLog {
  _id?: string
  business_id: string
  customer_id: string
  reminder_id?: string
  phone_number: string
  template_name: string
  message_id: string
  message_status: string
  error_message?: string
  sent_at?: Date
}

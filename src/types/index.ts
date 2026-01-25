export interface IBusinessType {
  _id?: string;
  name: string;
  slug: string;
  description?: string;
  is_active: boolean;
  created_at?: Date;
}

export interface IBusiness {
  _id?: string;
  business_type_id: string;
  business_name: string;
  owner_name: string;
  phone_number: string;
  address: string;
  city: string;
  is_active: boolean;
  created_at?: Date;
  waba_id: string;
  phone_number_id: string;
  phone_number_display?: string;
  access_token?: string;
}

export interface ICustomer {
  _id?: string;
  business_id: string;
  name: string;
  phone_number: string;
  email?: string;
  address?: string;
  is_active: boolean;
  created_at?: Date;
}

export interface IVehicle {
  _id?: string;
  customer_id: ICustomer;
  vehicle_type: string;
  brand: string;
  vehicle_model: string;
  registration_number: string;
  year: number;
  daily_travel: number;
  service_date?: Date;
  created_at?: Date;
}

export interface IService {
  _id?: string;
  vehicle_id: IVehicle;
  last_service_date: Date;
  next_service_date: Date;
  service_interval_days: number;
  notes?: string;
  created_at?: Date;
  status: string;
}

export interface IReminder {
  _id?: string;
  service_id: IService;
  customer_id?: ICustomer;
  vehicle_id?: IVehicle;
  business_id?: string;
  scheduled_for: Date;
  due_date: Date;
  status: string;
  retry_count: number;
  last_attempt_at?: Date;
  last_sent_at?: Date;
  sent_history?: Date[];
  pending_details?: string;
  created_at?: Date;
}

export interface IWhatsAppLog {
  _id?: string;
  business_id: string;
  customer_id: string;
  reminder_id?: string;
  phone_number: string;
  template_name: string;
  message_id: string;
  message_status: string;
  error_message?: string;
  sent_at?: Date;
}

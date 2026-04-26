export enum UserRole {
  ADMIN = 'admin',
  TWO_WHEELER_SERVICE = 'two_wheeler_service',
}

export interface IState {
  _id?: string;
  name: string;
  is_active: boolean;
  created_at?: Date;
}

export interface IZone {
  _id?: string;
  name: string;
  state_id: string | IState;
  is_active: boolean;
  created_at?: Date;
}

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
  business_type_id: string | IBusinessType;
  business_name: string;
  owner_name: string;
  email?: string;
  phone_number: string;
  address: string;
  city: string;
  state: string;
  zone: string;
  state_id?: string | IState;
  zone_id?: string | IZone;
  is_active: boolean;
  created_at?: Date;
  business_id?: string;
  waba_id: string;
  phone_number_id: string;
  phone_number_display?: string;
  access_token?: string;
  monthly_message_limit?: number;
  current_month_message_count?: number;
  last_limit_reset_date?: string | Date;
  qr_code_id?: string | IQRCode;
}

export interface IQRCode {
  _id?: string;
  qr_id: number;
  code: string;
  prefilled_message?: string;
  deep_link_url?: string;
  qr_image_url?: string;
  business_id?: string | IBusiness;
  created_at?: string | Date;
}

export enum FlowStep {
  START = 'START',
  ASK_VEHICLE = 'ASK_VEHICLE',
  VEHICLE_CONFIRM = 'VEHICLE_CONFIRM',
  ASK_LAST_SERVICE = 'ASK_LAST_SERVICE',
  ASK_VEHICLE_TYPE = 'ASK_VEHICLE_TYPE',
  ASK_DAILY_USAGE = 'ASK_DAILY_USAGE',
  ASK_MODEL = 'ASK_MODEL',
  RETURNING_USER_OPTIONS = 'RETURNING_USER_OPTIONS',
  COMPLETED = 'COMPLETED',
}

export enum OnboardingStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
}

export interface ICustomer {
  _id?: string;
  business_id: string;
  name: string;
  phone_number: string;
  email?: string;
  is_active: boolean;
  onboarding?: {
    status: OnboardingStatus;
    current_step: FlowStep;
    draft?: {
      vehicle_number?: string;
      last_service_option?: string;
      next_service_date?: Date | string;
      vehicle_type?: string;
      daily_usage?: string;
      vehicle_model?: string;
    };
    last_interaction_at?: Date | string;
  };
  created_at?: Date;
}

export interface IVehicle {
  _id?: string;
  customer_id: string | ICustomer;
  vehicle_type: string;
  brand: string;
  vehicle_model: string;
  variant?: string;
  fuel_type?: string;
  registration_number: string;
  year: number;
  daily_travel: number;
  next_service_due_km?: number;
  service_date?: Date;
  reminders?: IReminder[];
  active_reminder?: IReminder;
  created_at?: Date;
}

export enum ReminderStatus {
  PENDING = 'pending',
  BEFORE_7_DAYS = 'before_7_days',
  BEFORE_2_DAYS = 'before_2_days',
  ON_DUE_DATE = 'on_due_date',
  AFTER_3_DAYS = 'after_3_days',
  AFTER_10_DAYS = 'after_10_days',
  AFTER_30_DAYS = 'after_30_days',
  LOST_SERVICE_CYCLE = 'lost_service_cycle',
  COMPLETED = 'completed',
}

export interface IService {
  _id?: string;
  vehicle_id: string | IVehicle;
  last_service_date: Date;
  next_service_date: Date;
  service_interval_days: number;
  notes?: string;
  created_at?: Date;
  status: string;
}

export interface IReminder {
  _id?: string;
  service_id: string | IService;
  customer_id?: string | ICustomer;
  vehicle_id?: string | IVehicle;
  business_id?: string;
  scheduled_for: Date;
  due_date: Date;
  status: ReminderStatus;
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
  source: 'cron' | 'manual';
  status_history?: { status: string; timestamp: Date }[];
  error_message?: string;
  sent_at?: Date;
}

export type TemplateType = 'SERVICE_REMINDER' | 'SERVICE_COMPLETED' | 'FEEDBACK_REQUEST' | 'CUSTOM_MESSAGE';

export interface IBusinessTemplateConfig {
  _id?: string;
  business_id: string;
  template_type: TemplateType;
  template_name: string; // Meta template name
  parameter_format: 'POSITIONAL' | 'NAMED';
  template_language: string; // en, en_US
  is_active: boolean;
  status: 'APPROVED' | 'REJECTED' | 'PAUSED';
  template_category: string; // UTILITY, MARKETING
  template_sub_category?: string;
  meta_template_id: string; // Meta template ID
  created_at: Date;
  updated_at: Date;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  error?: {
    reason: string;
    code: number;
    [key: string]: any;
  };
}

export enum FuelType {
  PETROL = 'Petrol',
  DIESEL = 'Diesel',
  CNG = 'CNG',
  EV = 'EV',
  HYBRID = 'Hybrid',
}

export interface ICarVariant {
  name: string;
  fuel_types: FuelType[];
}

export interface ICarModel {
  name: string;
  variants: ICarVariant[];
}

export interface ICarBrand {
  _id?: string;
  name: string;
  models: ICarModel[];
  is_active: boolean;
  created_at?: Date;
  updated_at?: Date;
}

export interface ITwoWheelerModel {
  name: string;
}

export interface ITwoWheelerBrand {
  _id?: string;
  name: string;
  models: ITwoWheelerModel[];
  is_active: boolean;
  created_at?: Date;
  updated_at?: Date;
}

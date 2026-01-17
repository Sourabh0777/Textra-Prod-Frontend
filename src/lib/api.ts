const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  if (!API_BASE_URL) {
    return {
      success: false,
      error: "API URL not configured. Please set NEXT_PUBLIC_API_URL.",
    };
  }

  try {
    const url = `${API_BASE_URL}${endpoint}`;
    console.log(url);

    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    if (!response.ok) {
      return {
        success: false,
        error: `HTTP error! status: ${response.status}`,
      };
    }

    const data = await response.json();
    return {
      success: true,
      data: data,
    };
  } catch (error) {
    console.error("[API Error]", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

// Business Type APIs
export async function fetchBusinessTypes() {
  return fetchApi("/business-types");
}

// Business APIs
export async function fetchBusinesses() {
  return fetchApi("/businesses");
}

export async function fetchBusiness(id: string) {
  return fetchApi(`/businesses/${id}`);
}

export async function createBusiness(data: any) {
  return fetchApi("/businesses", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateBusiness(id: string, data: any) {
  return fetchApi(`/businesses/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteBusiness(id: string) {
  return fetchApi(`/businesses/${id}`, {
    method: "DELETE",
  });
}

// Customer APIs
export async function fetchCustomers(businessId?: string) {
  const endpoint = businessId ? `/customers?business_id=${businessId}` : "/customers";
  return fetchApi(endpoint);
}

export async function fetchCustomer(id: string) {
  return fetchApi(`/customers/${id}`);
}

export async function createCustomer(data: any) {
  return fetchApi("/customers", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateCustomer(id: string, data: any) {
  return fetchApi(`/customers/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteCustomer(id: string) {
  return fetchApi(`/customers/${id}`, {
    method: "DELETE",
  });
}

// Vehicle APIs
export async function fetchVehicles(customerId?: string) {
  const endpoint = customerId ? `/vehicles?customer_id=${customerId}` : "/vehicles";
  return fetchApi(endpoint);
}

export async function fetchVehicle(id: string) {
  return fetchApi(`/vehicles/${id}`);
}

export async function createVehicle(data: any) {
  return fetchApi("/vehicles", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateVehicle(id: string, data: any) {
  return fetchApi(`/vehicles/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteVehicle(id: string) {
  return fetchApi(`/vehicles/${id}`, {
    method: "DELETE",
  });
}

// Service APIs
export async function fetchServices(vehicleId?: string) {
  const endpoint = vehicleId ? `/services?vehicle_id=${vehicleId}` : "/services";
  return fetchApi(endpoint);
}

export async function fetchService(id: string) {
  return fetchApi(`/services/${id}`);
}

export async function createService(data: any) {
  return fetchApi("/services", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateService(id: string, data: any) {
  return fetchApi(`/services/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteService(id: string) {
  return fetchApi(`/services/${id}`, {
    method: "DELETE",
  });
}

// Reminder APIs
export async function fetchReminders(serviceId?: string) {
  const endpoint = serviceId ? `/reminders?service_id=${serviceId}` : "/reminders";
  return fetchApi(endpoint);
}

export async function fetchReminder(id: string) {
  return fetchApi(`/reminders/${id}`);
}

export async function createReminder(data: any) {
  return fetchApi("/reminders", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateReminder(id: string, data: any) {
  return fetchApi(`/reminders/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteReminder(id: string) {
  return fetchApi(`/reminders/${id}`, {
    method: "DELETE",
  });
}

// WhatsApp Log APIs
export async function fetchWhatsAppLogs() {
  return fetchApi("/whatsapp-logs");
}

export async function fetchWhatsAppLog(id: string) {
  return fetchApi(`/whatsapp-logs/${id}`);
}

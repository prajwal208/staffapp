export type WorkflowStatus = {
  id: string;
  name: string;
  color: string;
  icon: string;
  sortOrder?: number;
};

export type Staff = {
  id: string;
  name: string;
  phone: string;
  type: string;
  tailorId: string;
  boutiqueName: string;
  workflowStatusId: string | null;
  workflowStatus: WorkflowStatus | null;
};

export type StaffLoginResponse = {
  accessToken: string;
  expiresIn: number;
  staff: Staff;
};

export type ApiMeasurement = {
  name: string;
  value: number;
  unit: string;
};

export type ApiFeature = {
  label: string;
  value: string;
};

export type ApiDesignImage = {
  label: string;
  url: string;
};

export type CompleteOrderResponse = {
  billNo?: number;
  orderNo: number;
  orderId: string;
  orderType: string;
  previousStatus: string;
  currentStatus: string;
  workflowStatus: WorkflowStatus | null;
  customerName: string;
  customerPhone: string;
  category: string;
  deliveryDate: string;
  measurements: ApiMeasurement[];
  imageUrls: string[];
  features?: ApiFeature[];
  designImages?: ApiDesignImage[];
  customerImageUrl?: string;
  hangingsImageUrl?: string;
  patternImageUrl?: string;
  updatedAt: string;
};

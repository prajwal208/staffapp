let pendingPhone: string | null = null;

export function setPendingLoginPhone(phone: string) {
  pendingPhone = phone;
}

export function getPendingLoginPhone(): string | null {
  return pendingPhone;
}

export function clearPendingLoginPhone() {
  pendingPhone = null;
}

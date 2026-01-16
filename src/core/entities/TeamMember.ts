export interface TeamMember {
  id: string;
  firstName: string;
  lastName: string;
  document: string;
  phone: string;
  email: string;
  role: string;
  emergencyContact: {
    name: string;
    email: string;
    phone: string;
  }
}

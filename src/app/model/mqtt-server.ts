export interface MqttServer {
  id: string;
  server: string;
  wssPort: number;
  description?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

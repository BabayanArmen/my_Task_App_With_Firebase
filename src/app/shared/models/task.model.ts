export interface Task {
  id?: string;
  projectID?: string;
  userID: string;
  data: {
  title: string;
  status: string;
  }
}


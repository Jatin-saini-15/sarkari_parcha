export interface Feature {
  icon: string;
  title: string;
  desc: string;
  link: string;
}

export interface Exam {
  name: string;
  icon: string;
  link: string;
}

export interface ExamData {
  [key: string]: Exam[];
}

export interface Resources {
  [key: string]: string[];
}

export interface StatCard {
  icon: string;
  value: string;
  label: string;
} 
variable "aws_region" {
  description = "AWS region for the Task 4 network"
  type        = string
  default     = "us-east-1"
}

variable "project_name" {
  description = "Name prefix for Task 4 infrastructure resources"
  type        = string
  default     = "progree-task4"
}

variable "vpc_cidr" {
  description = "CIDR range for the isolated project VPC"
  type        = string
  default     = "10.20.0.0/16"
}

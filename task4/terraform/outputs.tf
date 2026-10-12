output "vpc_id" {
  description = "ID of the project VPC"
  value       = aws_vpc.main.id
}

output "private_subnet_ids" {
  description = "IDs of the two private subnet definitions"
  value = [
    aws_subnet.private_a.id,
    aws_subnet.private_b.id
  ]
}

output "workload_security_group_id" {
  description = "ID of the workload security group"
  value       = aws_security_group.workload.id
}
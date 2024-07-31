# Input string
input_string = "1 - 34"

# Step 1: Split the string
parts = input_string.split(" - ")

# Step 2: Convert the parts to integers
start = int(parts[0])
end = int(parts[1])

# Print the results
print(start + end)
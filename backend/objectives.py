import pdfplumber
import difflib

def extract_unit_content_first(pdf_path, header_height, footer_height, start_keyword, stop_keyword):
    with pdfplumber.open(pdf_path) as pdf:
        extracting = False  # Flag to indicate when to start and stop extraction
        extracted_text = []

        for page in pdf.pages:
            # Define the area without the header and footer
            bbox = (0, header_height, page.width, page.height - footer_height)
            cropped_page = page.within_bbox(bbox)
            text = cropped_page.extract_text()

            if text:  # Ensure there is text before processing
                # Check if the start keyword is found to begin extraction
                if start_keyword in text and not extracting:
                    extracting = True
                    # Add text up to where the start keyword is found
                    extracted_text.append(text.split(start_keyword, 1)[0])

                # Append text if extraction has started
                elif extracting:
                    extracted_text.append(text)

                # Check if the stop keyword is found to end extraction
                if stop_keyword in text and extracting:
                    extracting = False
                    break  # Stop processing further pages after finding the stop keyword

        return '\n'.join(extracted_text)

def extract_unit_content_second(pdf_path, header_height, footer_height, start_keyword, stop_keyword):
    with pdfplumber.open(pdf_path) as pdf:
        extracting = False  # Flag to indicate when to start and stop extraction
        extracted_text = []

        for page in pdf.pages:
            # Define the area without the header and footer
            bbox = (0, header_height, page.width, page.height - footer_height)
            cropped_page = page.within_bbox(bbox)
            text = cropped_page.extract_text()

            if text:  # Ensure there is text before processing
                # Check if the start keyword is found to begin extraction
                if start_keyword in text and not extracting:
                    extracting = True
                    # Add text from where the start keyword is found
                  

                # Append text if extraction has started
                elif extracting:
                    extracted_text.append(text)

                # Check if the stop keyword is found to end extraction
                if stop_keyword in text and extracting:
                    extracting = False
                    extracted_text.append(text.split(stop_keyword, 1)[0])
                    break  # Stop processing further pages after finding the stop keyword

        return '\n'.join(extracted_text)

def compare_extracted_texts(text1, text2):
    # Split the texts into lists of lines for comparison
    lines1 = text1.splitlines()
    lines2 = text2.splitlines()

    # Use difflib to get the differences between the two texts
    diff = difflib.ndiff(lines1, lines2)

    # Display only the differences in a readable format
    differences = []

    for line in diff:
        if line.startswith('- ') or line.startswith('+ '):
            # Strip the leading '- ' or '+ ' from the line
            differences.append(line[2:])  # Remove the first two characters

    return '\n'.join(differences)
# Example usage
pdf_path = 'TECH101_Module1_updated.pdf'
header_height = 70
footer_height = 50
start_keyword = 'MODULE LEARNING OBJECTIVES'
stop_keyword = 'LEARNING CONTENTS'

extracted_text_first = extract_unit_content_first(pdf_path, header_height, footer_height, start_keyword, stop_keyword)
extracted_text_second = extract_unit_content_second(pdf_path, header_height, footer_height, start_keyword, stop_keyword)

# Compare the texts and print the differences
differences = compare_extracted_texts(extracted_text_first, extracted_text_second)
# Output only from line 3 onward
output_lines = differences.splitlines()

# Store the output from line 3 in a variable
output_from_line_3 = '\n'.join(output_lines[2:])  # Skip the first two lines

# You can now use this variable as needed
print(output_from_line_3)  # Example of using the variable

import pdfplumber
import traceback

# Extract text from the PDF within specific bounds
def validate_file(pdf_file, header_height, footer_height):
    start_keyword = 'LEARNING CONTENTS'
    stop_keyword = 'SUMMARY'
    required_keywords = ['LEARNING OBJECTIVES','LEARNING CONTENTS']  # List of required keywords to check for

    try:
        with pdfplumber.open(pdf_file) as pdf:
            extracting = False  # Flag to indicate when to start and stop extraction
            extracted_text = []
            found_keywords = {key: False for key in required_keywords}  # Track if keywords are found

            for page in pdf.pages:
                # Define the area without the header and footer
                bbox = (0, header_height, page.width, page.height - footer_height)
                cropped_page = page.within_bbox(bbox)
                text = cropped_page.extract_text()

                if text:  # Ensure there is text before processing
                    # Check if each required keyword is present in the text
                    for keyword in required_keywords:
                        if keyword in text:
                            found_keywords[keyword] = True

                    # Check if the start keyword is found to begin extraction
                    if start_keyword in text and not extracting:
                        extracting = True
                        # Add text up to where the start keyword is found
                        extracted_text.append(text.split(start_keyword, 1)[1])

                    # Append text if extraction has started
                    elif extracting:
                        extracted_text.append(text)

                    # Check if the stop keyword is found to end extraction
                    if stop_keyword in text and extracting:
                        extracting = False
                        break  # Stop processing further pages after finding the stop keyword

            # Check if all required keywords were found
            if not all(found_keywords.values()):
                missing_keywords = [key for key, found in found_keywords.items() if not found]
                return "error"

            return '\n'.join(extracted_text)

    except Exception as e:
        print(f"Error during PDF extraction: {e}")
        print(traceback.format_exc())
        return None  # Return None if an error occurs

# Test the function with the specified PDF file
extracted_text = validate_file('Net-101-Study-Guide-Module1.pdf', 70, 50)
print(extracted_text)

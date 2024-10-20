import pdfplumber
import traceback 
# Extract text from the PDF within specific bounds
def extract_within_bounds(pdf_file, header_height, footer_height):
    start_keyword = 'LEARNING CONTENTS'
    stop_keyword = 'SUMMARY'
    try:
        with pdfplumber.open(pdf_file) as pdf:
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
                        extracted_text.append(text.split(start_keyword, 1)[1])

                    # Append text if extraction has started
                    elif extracting:
                        extracted_text.append(text)

                    # Check if the stop keyword is found to end extraction
                    if stop_keyword in text and extracting:
                        extracting = False
                        break  # Stop processing further pages after finding the stop keyword
            return '\n'.join(extracted_text)

    except Exception as e:
        print(f"Error during PDF extraction: {e}")
        print(traceback.format_exc())
        return None  # Return None if an error occurs
# Declare ques_gen as a global variable


extracted_text = extract_within_bounds('Net-101-Study-Guide-Module2.pdf', 70, 50)
print(extracted_text)
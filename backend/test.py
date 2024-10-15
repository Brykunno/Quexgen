import pdfplumber

def lesson_summary(pdf_path, header_height, footer_height, start_keyword, stop_keyword):
    # Remove spaces in the keywords for comparison
    start_keyword_clean = start_keyword.replace(" ", "")
    stop_keyword_clean = stop_keyword.replace(" ", "")
    
    with pdfplumber.open(pdf_path) as pdf:
        extracting = False  # Flag to indicate when to start and stop extraction
        extracted_text = []

        for page in pdf.pages:
            # Define the area without the header and footer
            bbox = (0, header_height, page.width, page.height - footer_height)
            cropped_page = page.within_bbox(bbox)
            text = cropped_page.extract_text()

            if text:  # Ensure there is text before processing
                # Remove spaces from the extracted text for comparison
                stripped_text = text.replace(" ", "").strip()

                # Check if the start keyword is found to begin extraction
                if start_keyword_clean in stripped_text and not extracting:
                    extracting = True
                    # Ensure the start keyword is in the text before splitting
                    if start_keyword in text:
                        extracted_text.append(text.split(start_keyword, 1)[1].strip())
                    else:
                        extracted_text.append(text)  # Fallback if split fails

                # Append text if extraction has started
                elif extracting:
                    extracted_text.append(text)

                # Check if the stop keyword is found to end extraction
                if stop_keyword_clean in stripped_text and extracting:
                    extracting = False
                    # Add text up to where the stop keyword is found
                    if stop_keyword in text:
                        extracted_text.append(text.split(stop_keyword, 1)[0].strip())
                    else:
                        extracted_text.append(text)  # Fallback if split fails
                    break  # Stop processing further pages after finding the stop keyword

        # Join the extracted text and split into lines
        lines = '\n'.join(extracted_text).splitlines()

        # Return the second line if it exists, otherwise return an empty string
        return lines[1].strip() if len(lines) > 1 else ''

# Example usage
pdf_path = 'Net-101-Study-Guide-Module1.pdf'
header_height = 70
footer_height = 50
start_keyword = 'STUDY GUIDE'
stop_keyword = 'MODULE OVERVIEW'

extracted_text = lesson_summary(pdf_path, header_height, footer_height, start_keyword, stop_keyword)
print(extracted_text)

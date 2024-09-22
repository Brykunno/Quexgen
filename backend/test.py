import pdfplumber

def extract_within_bounds(pdf_path, header_height, footer_height):
    with pdfplumber.open(pdf_path) as pdf:
        extracting = False  # Flag to control when to start and stop extraction
        extracted_text = []

        for page in pdf.pages:
            # Define the area without the header and footer
            bbox = (0, header_height, page.width, page.height - footer_height)
            cropped_page = page.within_bbox(bbox)
            text = cropped_page.extract_text()

            # Check if 'LEARNING CONTENT' is in the text to start extraction
            if 'LEARNING CONTENTS' in text:
                extracting = True
                # Add text from where 'LEARNING CONTENT' is found
                extracted_text.append(text.split('LEARNING CONTENTS', 1)[1])
            
            if extracting:
                # Append text if extraction has started
                extracted_text.append(text)

            # Check if 'LEARNING ACTIVITY' is in the text to stop extraction
            if 'SUMMARY' in text:
                extracting = False
                # Add text up to where 'LEARNING ACTIVITY' is found
              
                break  # Stop processing after finding 'LEARNING ACTIVITY'

        return '\n'.join(extracted_text)

# Example usage
extracted_text = extract_within_bounds('Net-101-Study-Guide-Module2.pdf', 70, 50)
print(extracted_text)

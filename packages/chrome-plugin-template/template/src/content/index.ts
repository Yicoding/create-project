/// <reference types="chrome"/>

// Types
interface MouseEventOptions {
  bubbles: boolean;
  cancelable: boolean;
  view: Window;
}

// Utility functions
const waitForElement = (selector: string, timeout = 5000): Promise<Element> => {
  return new Promise((resolve, reject) => {
    const checkElement = setInterval(() => {
      const element = document.querySelector(selector);
      if (element) {
        clearInterval(checkElement);
        resolve(element);
      }
    }, 500);

    setTimeout(() => {
      clearInterval(checkElement);
      reject(new Error(`Timeout waiting for element: ${selector}`));
    }, timeout);
  });
};

const simulateClick = (element: Element): void => {
  const mouseEventOptions: MouseEventOptions = {
    bubbles: true,
    cancelable: true,
    view: window
  };
  element.dispatchEvent(new MouseEvent('mousedown', mouseEventOptions));
  element.dispatchEvent(new MouseEvent('mouseup', mouseEventOptions));
  element.dispatchEvent(new MouseEvent('click', mouseEventOptions));
};

const simulateTyping = (span: Element, text: string): void => {
  for (let i = 0; i < text.length; i++) {
    span.dispatchEvent(new KeyboardEvent('keydown', {
      key: text[i],
      code: 'Key' + text[i].toUpperCase(),
      bubbles: true,
      cancelable: true
    }));

    span.dispatchEvent(new InputEvent('beforeinput', {
      inputType: 'insertText',
      data: text[i],
      bubbles: true,
      cancelable: true
    }));

    span.textContent = text.substring(0, i + 1);

    span.dispatchEvent(new InputEvent('input', {
      inputType: 'insertText',
      data: text[i],
      bubbles: true,
      cancelable: true
    }));

    span.dispatchEvent(new KeyboardEvent('keyup', {
      key: text[i],
      code: 'Key' + text[i].toUpperCase(),
      bubbles: true,
      cancelable: true
    }));
  }
};

const delay = (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms));

// Image processing functions
const getImageUrls = (): string[] => {
  const imageUrls: string[] = [];
  const imgBoxes = document.querySelectorAll('.image-box-grid-CFNCFQ');

  imgBoxes.forEach(imgBox => {
    const images = imgBox.querySelectorAll('img');
    images.forEach(img => {
      if (/^https:\/\//.test(img.src) && !imageUrls.includes(img.src) && img.src.includes('.png')) {
        imageUrls.push(img.src);
      }
    });
  });

  console.log('Current image URLs:', imageUrls);
  return imageUrls;
};

const waitForImages = (): Promise<string[]> => {
  return new Promise((resolve) => {
    const imageUrls: string[] = [];
    let imageRequestInterval: number | null = null;

    const checkImages = () => {
      const len = imageUrls.length;
      const newUrls = getImageUrls();
      imageUrls.push(...newUrls.filter(url => !imageUrls.includes(url)));

      if (len < imageUrls.length) {
        console.log('New images detected, waiting for more...');
        setTimeout(() => {
          if (imageRequestInterval) {
            clearInterval(imageRequestInterval);
            imageRequestInterval = null;
          }
          console.log('Final image URLs:', imageUrls);
          resolve(imageUrls);
        }, 500);
      }
    };

    imageRequestInterval = setInterval(checkImages, 500);
    setTimeout(() => {
      if (imageRequestInterval) {
        clearInterval(imageRequestInterval);
        console.log('Timeout reached, final image URLs:', imageUrls);
        resolve(imageUrls);
      }
    }, 50 * 1000);
  });
};

// Main process function
const processImageRequest = async (text: string): Promise<void> => {
  console.log('Starting process for text:', text);
  await delay(1000);

  // Click the skill button
  console.log('Clicking skill button...');
  const skillButton = await waitForElement('div[data-testid="skill_bar_button_3"]');
  simulateClick(skillButton);
  await delay(500);

  // Handle input
  console.log('Handling input...');
  const inputElement = await waitForElement('span[data-slate-leaf="true"]');
  const span = inputElement.querySelector('span');
  if (!span) throw new Error('Span element not found');

  // Modify span attributes
  span.removeAttribute('data-slate-placeholder');
  span.removeAttribute('contenteditable');
  span.removeAttribute('style');
  span.setAttribute('data-slate-string', 'true');

  // Type text
  console.log('Typing text...');
  simulateTyping(span, text);
  await delay(500);

  // Send message
  console.log('Sending message...');
  const sendButton = await waitForElement('button[id="flow-end-msg-send"]');
  simulateClick(sendButton);

  // Wait for images
  console.log('Waiting for images...');
  const finalImages = await waitForImages();
  console.log('Process completed with images:', finalImages);
};

// Main event listener
window.addEventListener('load', async () => {
  console.log('Page loaded, checking for doubaoText...');
  chrome.storage.local.get(['doubaoText'], async (result) => {
    if (!result.doubaoText) {
      console.log('No doubaoText found');
      return;
    }

    try {
      console.log('Processing doubaoText...');
      const textArray = result.doubaoText.split('<==>');
      console.log('Split into', textArray.length, 'items');

      for (const text of textArray) {
        await processImageRequest(text);
      }

      // Clear storage after processing
      console.log('Clearing storage...');
      chrome.storage.local.remove(['doubaoText']);
      console.log('All processes completed');
    } catch (error) {
      console.error('Error in automation flow:', error);
    }
  });
}); 
// Function to handle dynamic song details and navigation
document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // Select all stream-now buttons
  const streamButtons = document.querySelectorAll('.stream-now-button');

  // Add click event listeners to all buttons
  streamButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault(); // Prevent default navigation

      // Extract song details from data attributes
      const songData = {
        title: button.getAttribute('data-title'),
        image: button.getAttribute('data-image'),
      };

      // Store song details in localStorage
      localStorage.setItem('selectedSong', JSON.stringify(songData));

      // Redirect to the stream now page
      window.location.href = 'streamnowpage.html';
    });
  });

  // Function to load and display song details on the streamnowpage.html
  const songData = JSON.parse(localStorage.getItem('selectedSong'));
  if (songData) {
    const songImageElement = document.querySelector('.song-image');
    const songTitleElement = document.querySelector('.song-title');

    if (songImageElement) {
      songImageElement.src = songData.image;
      songImageElement.alt = songData.title;
    }

    if (songTitleElement) {
      songTitleElement.textContent = `Stream "${songData.title}" now!`;
    }
  } else {
    console.warn('No song data found in localStorage.');
  }
});


// Function for shop.html and tour.html to change the product details dynamically
// Storing the product details and redirecting to the purchase page
(function () {
  'use strict';

  // Function to handle product click and update product details
  document.addEventListener('DOMContentLoaded', () => {
    // Select all product links
    const productLinks = document.querySelectorAll('.product-link');

    // Add click event listeners to all links
    productLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault(); // Prevent default navigation

        // Extract product details from data attributes
        const productData = {
          title: link.getAttribute('data-title'),
          price: link.getAttribute('data-price'),
          description: link.getAttribute('data-description'),
          image: link.getAttribute('data-image'),
        };

        // Store product details in localStorage
        localStorage.setItem('selectedProduct', JSON.stringify(productData));

        // Redirect to the product display page
        window.location.href = 'purchasepage.html';
      });
    });
  });
})();

//Loading and displaying product details on the purchase page
(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    // Check if there's product data in localStorage
    const productData = JSON.parse(localStorage.getItem('selectedProduct'));

    if (productData) {
      // Update product display page
      document.querySelector('.purchase-page img').src = productData.image;
      document.querySelector('.purchase-page img').alt = productData.title;
      document.querySelector('.purchase-page h2').textContent = productData.title;
      document.querySelector('.purchase-page .title').textContent = productData.price;
      document.querySelector('.purchase-page p:nth-of-type(2)').textContent = productData.description;

    } else {
      console.warn('No product data found in localStorage.');
    }
  });
})();

//Function to remove the size option if the product is not a clothing item
function updateSizeOptionBasedOnTitle() {
  // Get the product title
  const productTitleElement = document.querySelector('.purchase-info h2');
  const sizeField = document.getElementById('size'); // Size dropdown
  const sizeLabel = document.querySelector('label[for="size"]'); // Size label

  if (!productTitleElement) {
    console.error('Product title not found!');
    return;
  }

  const productTitle = productTitleElement.textContent.toLowerCase();

  // Check if the product title includes "tee" or "longsleeve"
  if (productTitle.includes('tee') || productTitle.includes('longsleeve')) {
    // Show size field if it's a tee or longsleeve
    sizeField.style.display = 'block';
    sizeLabel.style.display = 'block';
  } else {
    // Hide size field and label if it's not a tee or longsleeve
    sizeField.style.display = 'none';
    sizeLabel.style.display = 'none';
  }
}

// Call the function when the page loads
document.addEventListener('DOMContentLoaded', () => {
  updateSizeOptionBasedOnTitle();
});


//Function for counter in the purchase page to increase or decrease the quantity. Caps the quantity at 5
(function () {
  'use strict';

  // Class to control quantity increment and decrement
  class QuantityController {
    constructor(incrementId, decrementId, quantityId) {
      // Select elements
      this.incrementButton = document.querySelector(`#${incrementId}`);
      this.decrementButton = document.querySelector(`#${decrementId}`);
      this.quantityInput = document.querySelector(`#${quantityId}`);

      // Validate elements
      if (!this.incrementButton || !this.decrementButton || !this.quantityInput) {
        console.error(
          'One or more elements are missing: increment, decrement, quantity'
        );
        return;
      }

      console.log('Elements initialized:', this.incrementButton, this.decrementButton, this.quantityInput);

      // Define constants
      this.maxQuantity = 5;
      this.minQuantity = 1;

      // Add event listeners
      this.incrementButton.addEventListener('click', () => {
        this.changeQuantity(1);
      });

      this.decrementButton.addEventListener('click', () => {
        this.changeQuantity(-1);
      });
    }

    // Function to change quantity
    changeQuantity(change) {
      const currentValue = parseInt(this.quantityInput.value, 10) || this.minQuantity;
      const newValue = currentValue + change;

      if (newValue >= this.minQuantity && newValue <= this.maxQuantity) {
        this.quantityInput.value = newValue;
        console.log(`Quantity updated to: ${newValue}`);
      } else {
        console.warn('Quantity change out of bounds:', newValue);
      }
    }
  }

  // Initialize the QuantityController
  document.addEventListener('DOMContentLoaded', () => {
    new QuantityController('increment', 'decrement', 'quantity');
  });
})();

//Function for the index page sliders to shift slides left and right and make it responsive
(function () {
  'use strict';

  // A class for building sliders from it
  class Slider {
    constructor(id, mediaQueries) {
      // Get HTML elements
      this.slider = document.querySelector(`#${id}`);
      this.sliderList = this.slider.querySelector('.product-list');
      this.sliderItems = this.slider.querySelectorAll('.product');
      this.sliderNext = this.slider.querySelector('.slider-arrow-next');
      this.sliderPrev = this.slider.querySelector('.slider-arrow-prev');

      // Get media queries
      this.mediaQueryList = [window.matchMedia(`screen and (max-width:${mediaQueries[0] - 1}px)`)];
      mediaQueries.forEach((mediaQuery) => {
        this.mediaQueryList.push(window.matchMedia(`screen and (min-width:${mediaQuery}px)`));
      });

      // Define global variables
      this.numberOfVisibleItems = null;
      this.currentItemIndex = null;
      this.sliderItemsLength = this.sliderItems.length;
      this.mediaQueryLength = this.mediaQueryList.length;

      // Add event listener: to call the run function again when screen resized
      this.mediaQueryList.forEach((mediaQuery) => {
        mediaQuery.addEventListener('change', () => {
          this.run();
        });
      });

      // Add event listener: to go to next slide
      this.sliderNext.addEventListener('click', () => {
        if (this.currentItemIndex < this.sliderItemsLength - this.numberOfVisibleItems) {
          this.currentItemIndex++;
          this.shiftSlides();
        }
      });

      // Add event listener: to go to previous slide
      this.sliderPrev.addEventListener('click', () => {
        if (this.currentItemIndex > 0) {
          this.currentItemIndex--;
          this.shiftSlides();
        }
      });

      // Disable focus on all slides links
      this.sliderItems.forEach((item) => {
        const elements = item.querySelectorAll('a');
        elements.forEach((element) => {
          element.tabIndex = '-1';
        });
      });

      // Add event listener: to scroll down to slider when previous arrow focused
      this.sliderPrev.addEventListener('focusin', () => {
        this.slider.scrollIntoView();
      });

      // Add event listener: to scroll down to slider when next arrow focused
      this.sliderNext.addEventListener('focusin', () => {
        this.slider.scrollIntoView();
      });
    }

    // Run the slider
    run() {
      let index = this.mediaQueryLength - 1;
      while (index >= 0) {
        if (this.mediaQueryList[index].matches) {
          // Set number of visible slides
          this.numberOfVisibleItems = index + 1;

          // Reset the slider
          this.currentItemIndex = 0;
          this.sliderList.style.transform = 'translateX(0%)';

          // Set slider list width
          this.sliderList.style.width = `calc(${(100 / this.numberOfVisibleItems) * this.sliderItemsLength}% + ${(this.sliderItemsLength / this.numberOfVisibleItems) * 16}px)`;

          // Set slides width
          this.sliderItems.forEach((item) => {
            item.style.width = `${100 / this.numberOfVisibleItems}%`;
          });

          // Exit the loop
          break;
        }
        index--;
      }
    }

    // A function to shift slides left and right
    shiftSlides() {
      this.sliderList.style.transform = `translateX(-${(100 / this.sliderItemsLength) * this.currentItemIndex}%)`;
    }
  }

  /* 
  Note about creating new slider:
  First parameter is the id of the HTML slider-container element of each slider.
  Second parameter is an array of the media queries (breaking points) where the number of slides increases.
  */

  // Create a new slider and run it
  new Slider('new-products', [576, 992]).run();

  // Create a new slider and run it
  new Slider('featured-products', [576, 768, 992]).run();
})();


// Function to show and hide the sidebar
function showSidebar(){
const sidebar = document.querySelector('.sidebar')
sidebar.style.display = 'flex'
}
function hideSidebar(){
const sidebar = document.querySelector('.sidebar')
sidebar.style.display = 'none'
}



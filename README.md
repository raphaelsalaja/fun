Thank you for the opportunity to work on this take-home challenge. I enjoyed building this project and showcasing my skills in modern web development.

This document outlines the project setup, development process, and key architectural decisions.

## Setup and Installation

To run the project locally, please follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/raphaelsalaja/fun-take-home-challenge.git
    cd fun-take-home-challenge
    ```

2.  **Install dependencies:**
    ```bash
    pnpm install
    ```

3.  **Start the development server:**
    ```bash
    pnpm dev
    ```

The application will be available at `http://localhost:3000`.

## Development Process

My approach was to first establish the core conversion functionality and then progressively enhance the user experience and feature set.

### 1. Core Conversion Logic

The main focus was the token conversion mechanism. I implemented this by:
- Using **Tanstack Query** to create custom hooks for fetching data from the **Funkit API**.
- Ensuring robust handling of loading and error states to provide clear feedback to the user.

### 2. Layout and Design

I experimented with different layouts in Figma to find the most effective design.
- I initially considered a `1x2` grid but found it wasn't responsive enough for smaller screens.
- I settled on a more flexible **single-column layout** that uses a central toggle to swap tokens, ensuring a seamless experience across all devices.

### 3. Component Architecture and Styling

With the layout defined, I created the necessary components:
- **Styling**: I used **CSS Modules** to create modular, reusable, and scoped styles for each component.
- **Animations**: I integrated **Motion** and CSS transitions to create smooth and intuitive animations for state changes. The **NumberFlow** component was used to animate numerical value changes, enhancing the user experience.

### 4. Expanding Functionality

After implementing the core features, I expanded the application's capabilities:
- **Token Variety**: To offer a wider selection of tokens, I integrated the **`@uniswap/default-tokens-list`**. I processed this list to group tokens by their `chainId`, allowing users to select tokens from specific networks.
- **UI for Token Selection**: I implemented a **stacked dialog** component to present the network and token selection in an organized manner.
- **Dynamic Token Images**: I dynamically fetched token images from the Uniswap assets repository on GitHub using the `chainId` and token address. For missing or outdated images, I implemented a fallback system that shows a placeholder or a swapped asset image.

## Conclusion

I am pleased with the final solution. I believe it effectively demonstrates my ability to build a polished, functional, and user-friendly application using modern web technologies. Thank you again for this opportunity.

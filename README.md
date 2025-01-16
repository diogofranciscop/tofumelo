  <div align="center">
    <img src="assets/img/logo.webp" alt="Tofumelo Banner" width="50%">
    <h1>Tofumelo</h1>
    <h4>A static website featuring a collection of plant-based recipes, free from animal products.</h4>
  </div>

## 🌟 Key Features
- **Dynamic Recipe Filtering**: Filter recipes by category or search for specific keywords.
- **Mobile-Friendly Design**: Fully responsive layout for a seamless experience on all devices.
- **Chatbot Integration**: An AI-powered chatbot embedded via an iframe to provide personalized recipe recommendations and discuss veganism.
- **Automated Deployment**: Deployed using GitHub Pages and enhanced with Cloudflare for fast and efficient updates.

---

## 🛠️ Tech Stack
- **Static Site Generator**: [Jekyll](https://jekyllrb.com/)
- **Languages**: HTML, CSS, JavaScript, Liquid, YAML
- **Deployment**: GitHub Pages and Cloudflare
- **Version Control**: Git and GitHub

---

## 🧠 Chatbot Integration Details

The chatbot is embedded into the website using an iframe and runs as a standalone service hosted separately. It enhances the user experience by:
- **Personalized Recipe Search**: Helping users find recipes based on their preferences or available ingredients.
- **Veganism Support**: Providing tips and guidance for transitioning to or maintaining a vegan lifestyle.
- **Enhanced Accessibility**: Offering a conversational interface for effortless navigation and content discovery.

### Technical Details
- **Chatbot Implementation**: Developed as a separate service. View the repository here: [chatbot-tofumelo](https://github.com/diogofranciscop/chatbot-tofumelo).
- **Integration**: Added to the site via a simple `<iframe>` element for modularity and ease of updates.


## Live Demo
Check out the website: [Tofumelo](https://tofumelo.pt)

# Run Locally
## Prerequisites
Ensure you have the following installed:
- **Ruby**: [Installation Guide](https://www.ruby-lang.org/en/documentation/installation/)
- **Jekyll**: Install it by running:
`gem install jekyll bundler`
## Steps
1. Clone the repository:
```bash
git clone https://github.com/diogofranciscop/Tofumelo.git
cd Tofumelo
```
2. Install dependencies:
```bash
bundle install
```
3. Serve the website locally:
```bash
bundle exec jekyll serve
```
4. Open the website in your browser
```plaintext
http://localhost:4000
```
## Test on other devices
To test the website on devices connected to the same Wi-Fi network:

1. Run:
```bash
bundle exec jekyll serve --host 0.0.0.0
```

2. Find your IP address and access the site:
```plaintext
http://your_ip_address:4000
```
# License
This project is released under the MIT Licence

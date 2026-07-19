FROM node:20-alpine

WORKDIR /app

# Copy dependency definition
COPY package*.json ./

# Install packages
RUN npm install

# Copy source files
COPY . .

# Expose port
EXPOSE 5173

# Start development server
CMD ["npm", "run", "dev"]

FROM node:8
COPY vg.js /app/
CMD ["npm", "install"]
CMD ["node", "/app/vg.js"]

const sanitizeObject = (obj) => {
  if (obj && typeof obj === "object") {
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        if (key.startsWith("$") || key.includes(".")) {
          delete obj[key];
        } else {
          sanitizeObject(obj[key]);
        }
      }
    }
  }
};

const mongoSanitize = () => {
  return (req, res, next) => {
    if (req) {
      if (req.body) sanitizeObject(req.body);
      if (req.query) sanitizeObject(req.query);
      if (req.params) sanitizeObject(req.params);
    }
    next();
  };
};

module.exports = mongoSanitize;

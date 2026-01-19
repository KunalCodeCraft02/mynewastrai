const jwt = require("jsonwebtoken");

const isLoggedin = (req, res, next) => {
    if (!req.cookies.token) {
       
        if (req.headers.accept && req.headers.accept.includes('application/json')) {
            return res.status(401).json({ success: false, message: "You must be logged in" });
        }
        return res.send(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Authentication Required</title>
            </head>
            <body>
                <script>
                    alert("You must be logged in");
                    window.location.href = "/ragister";
                </script>
            </body>
            </html>
        `);
    } else {
        try {
            let data = jwt.verify(req.cookies.token, process.env.JWT_SECRET);
            req.user = data;
            next();
        } catch (e) {
           
            if (req.headers.accept && req.headers.accept.includes('application/json')) {
                return res.status(401).json({ success: false, message: "Invalid token" });
            }
            return res.send(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Authentication Error</title>
                </head>
                <body>
                    <script>
                        alert("Invalid token. Please login again");
                        window.location.href = "/userlogin";
                    </script>
                </body>
                </html>
            `);
        }
    }
};

module.exports = isLoggedin;
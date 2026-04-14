const sendEmail = async (to, subject, html) => {
    try {
        const response = await fetch('https://api.brevo.com/v3/smtp/email', {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'api-key': process.env.BREVO_API_KEY,
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                sender: { name: "XStyle Premium", email: "noreply@xstyle.com" },
                to: [{ email: to }],
                subject: subject,
                htmlContent: html
            })
        });
        const data = await response.json();
        return data;
    } catch (err) {
        console.error('Email Error:', err.message);
    }
};

module.exports = sendEmail;

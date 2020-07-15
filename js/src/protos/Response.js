/**
 * Parse a request's response text as XML
 * @returns {Promise<Document>}
 * @memberof Response
 **/
Response.prototype.xml = async function () {
    const text = await this.text(),
        parser = new DOMParser(),
        xml = parser.parseFromString(text, "text/xml");

    return xml.documentElement;
};
/**
 * Parse a request's response text as HTML
 * @returns {Promise<Document>}
 * @memberof Response
 **/
Response.prototype.html = async function () {
    const text = await this.text(),
        parser = new DOMParser(),
        xml = parser.parseFromString(text, "text/html");

    return xml.documentElement;
};
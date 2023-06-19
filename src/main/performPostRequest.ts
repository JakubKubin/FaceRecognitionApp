import { net } from 'electron'

const performPostRequest = (data, endpoint) => new Promise((resolve, reject) => {
    const body = JSON.stringify(data)
    const request = net.request({
      method: "POST",
      protocol: "http:",
      hostname: "localhost",
      port: 8080,
      path: endpoint
    })
  
    request.setHeader('Content-Type', 'application/json');
    request.write(body, "utf-8")
    
    request.on("response", (response) => {
      let output = ""
  
      response.on("end", () => {
        resolve(output)
      })
  
      response.on("data", (chunk) => {
        output += chunk.toString()
      })
  
    })
  
    request.end()
})

export default performPostRequest
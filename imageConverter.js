// Hàm convertImageToGIF
function convertImageToGIF(base64Image) {
    // Thay thế 'your-api-secret' bằng API secret thực tế của bạn
    return fetch('https://v2.convertapi.com/convert/webp/to/gif?Secret=U0awzP5idHhIeWlL', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            "Parameters": [
                {
                    "Name": "Files",
                    "FileValues": [
                        {
                            "Name": "image.webp",
                            "Data": base64Image
                        }
                    ]
                },
                {
                    "Name": "StoreFile",
                    "Value": true
                }
            ]
        })
    })
    .then(response => response.json())
    .then(data => {
        // Giả sử URL của file GIF nằm trong phần trả về của API
        // Bạn cần thay đổi dòng này cho phù hợp với cấu trúc phản hồi của API
        return data.Files[0].Url;
    })
    .catch(error => {
        console.error("Lỗi khi gọi API chuyển đổi:", error);
        throw error;
    });
}

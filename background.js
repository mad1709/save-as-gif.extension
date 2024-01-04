// Hàm getBase64ImageFromUrl từ base64Image.js
function getBase64ImageFromUrl(imageUrl) {
  console.log("Bắt đầu tải ảnh từ URL:", imageUrl); // Ghi lại URL của ảnh

  return fetch(imageUrl)
      .then(response => response.blob())
      .then(blob => {
          return new Promise((resolve, reject) => {
              const reader = new FileReader();
              reader.onloadend = () => {
                  console.log("Ảnh đã chuyển thành Base64"); // Ghi lại sau khi chuyển đổi
                  resolve(reader.result);
                  console.log
              };
              reader.onerror = () => {
                  console.error("Lỗi khi chuyển đổi ảnh sang Base64"); // Ghi lại lỗi
                  reject(reader.error);
              };
              reader.readAsDataURL(blob);
          });
      });
}

chrome.runtime.onInstalled.addListener(function() {
  chrome.contextMenus.create({
    id: "saveAsGif",
    title: "Save as GIF",
    contexts: ["image"]
  });
});

chrome.contextMenus.onClicked.addListener(function(info, tab) {
  if (info.menuItemId === "saveAsGif" && info.srcUrl) {
    console.log("Đã chọn ảnh:", info.srcUrl); // Ghi lại URL của ảnh

    getBase64ImageFromUrl(info.srcUrl)
      .then(base64Image => {
        console.log("Ảnh dạng Base64:", base64Image); // Ghi lại ảnh dưới dạng Base64

        convertImageToGIF(base64Image)
          .then(gifUrl => {
            console.log("URL của GIF:", gifUrl); // Ghi lại URL của file GIF

            const path = generateDownloadPath(tab, 'saved_image.gif');
            console.log("Đường dẫn tải xuống:", path); // Ghi lại đường dẫn tải xuống

            chrome.downloads.download({
              url: gifUrl,
              filename: path,
              conflictAction: 'uniquify'
            });
          })
          .catch(error => console.error('Lỗi khi chuyển đổi ảnh:', error));
      })
      .catch(error => console.error('Lỗi khi lấy ảnh Base64:', error));
  }
});

// Hàm convertImageToGIF
function convertImageToGIF(base64Image) {
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
    console.log("Dữ liệu trả về từ API:", data); // In dữ liệu trả về để kiểm tra

    // Kiểm tra và đảm bảo rằng data.Files và data.Files[0] tồn tại
    if (data.Files && data.Files[0]) {
      return data.Files[0].Url;
    } else {
      throw new Error("Cấu trúc dữ liệu trả về từ API không đúng");
    }
  })
  .catch(error => {
    console.error("Lỗi khi gọi API chuyển đổi:", error);
    throw error;
  });
}



function generateDownloadPath(tab, filename) {
  const date = new Date();
  const formattedDate = date.toISOString().split('T')[0];
  const pageTitle = tab.title ? tab.title.replace(/[^a-zA-Z0-9]/g, '_') : 'default_title';
  return `1.SaveAsGif/${formattedDate}/${pageTitle}/${filename}`;
}
// Sự kiện contextMenus.onClicked
chrome.contextMenus.onClicked.addListener(function(info, tab) {
  // Logic xử lý khi người dùng click vào menu ngữ cảnh
});
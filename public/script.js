
let galleryData = []

// โหลดข้อมูลจาก JSON
async function loadData() {
  try {
    const response = await fetch(CONFIG.dataFile)
    galleryData = await response.json()
  } catch (error) {
    console.error("Error loading data:", error)
    galleryData = []
  }
}

// ตรวจสอบรหัสผ่าน
function checkPassword() {
  const input = document.getElementById("passwordInput")
  const errorMessage = document.getElementById("errorMessage")
  const exampleContainer = document.getElementById("exampleImagesContainer")

  if (input.value === CONFIG.password) {
    document.getElementById("loginPage").style.display = "none"
    document.getElementById("galleryPage").style.display = "block"
    loadData().then(() => {
      displayGallery(galleryData)
    })
  } else {
    errorMessage.textContent = CONFIG.wrongPasswordMessage
    exampleContainer.classList.remove("hidden")
    exampleContainer.innerHTML = ""

    CONFIG.exampleImages.forEach((imgUrl) => {
      const img = document.createElement("img")
      img.src = imgUrl
      img.alt = "Example image"
      exampleContainer.appendChild(img)
    })
  }
}

// แสดงแกลเลอรี่
function displayGallery(data) {
  const grid = document.getElementById("galleryGrid")
  grid.innerHTML = ""

  if (data.length === 0) {
    grid.innerHTML = '<div class="no-results">ไม่พบข้อมูล</div>'
    return
  }

  data.forEach((item) => {
    const galleryItem = document.createElement("div")
    galleryItem.className = "gallery-item"

    let content = `
      <div class="gallery-item-header">
        <h3>👤 ${item.user}</h3>
        ${item.text ? `<p>${item.text}</p>` : ""}
      </div>
      <div class="gallery-item-content">
    `

    // แสดงภาพ
    item.images.forEach((imgUrl) => {
      content += `<img src="${imgUrl}" alt="${item.user}" onclick="openModal('${imgUrl}')">`
    })

    // แสดงวีดีโอ
    item.videos.forEach((videoUrl) => {
      content += `<video controls>
        <source src="${videoUrl}" type="video/mp4">
        Your browser does not support the video tag.
      </video>`
    })

    content += "</div>"
    galleryItem.innerHTML = content
    grid.appendChild(galleryItem)
  })
}

function searchGallery() {
  const searchTerm = document.getElementById("searchInput").value.trim().toLowerCase()

  if (!searchTerm) {
    showAll()
    return
  }

  const filteredData = galleryData.filter((item) => item.user.toLowerCase().includes(searchTerm))

  // แสดงผลลัพธ์การค้นหา
  const grid = document.getElementById("galleryGrid")
  grid.innerHTML = ""

  // สร้างข้อความแสดงผลการค้นหา
  const resultMessage = document.createElement("div")
  resultMessage.className = "search-result"

  if (filteredData.length > 0) {
    resultMessage.textContent = `เจอ ${filteredData.length} รายการจากการค้นหา "${searchTerm}"`
    resultMessage.style.color = "#27ae60"
  } else {
    resultMessage.textContent = `ไม่พบข้อมูลจากการค้นหา "${searchTerm}"`
    resultMessage.style.color = "#e74c3c"
  }

  grid.appendChild(resultMessage)

  // แสดงรายการที่เจอ
  if (filteredData.length > 0) {
    displayGallery(filteredData)
  } else {
    const noResults = document.createElement("div")
    noResults.className = "no-results"
    noResults.textContent = "ลองค้นหาด้วยคำอื่นดูไหม?"
    grid.appendChild(noResults)
  }
}

// แสดงทั้งหมด
function showAll() {
  document.getElementById("searchInput").value = ""
  displayGallery(galleryData)
}

// ออกจากระบบ
function logout() {
  document.getElementById("loginPage").style.display = "flex"
  document.getElementById("galleryPage").style.display = "none"
  document.getElementById("passwordInput").value = ""
  document.getElementById("errorMessage").textContent = ""
  document.getElementById("exampleImagesContainer").classList.add("hidden")
}

// เปิด Modal ภาพ
function openModal(imgUrl) {
  const modal = document.getElementById("imageModal")
  const modalImg = document.getElementById("modalImage")
  modal.style.display = "block"
  modalImg.src = imgUrl
}

// ปิด Modal
function closeModal() {
  document.getElementById("imageModal").style.display = "none"
}

// Enter key สำหรับรหัสผ่าน
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("passwordInput")?.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      checkPassword()
    }
  })

  // Enter key สำหรับค้นหา
  document.getElementById("searchInput")?.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      searchGallery()
    }
  })
})

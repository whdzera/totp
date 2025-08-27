import { Controller } from "@hotwired/stimulus";
import Swal from "sweetalert2";

// Base32 characters
const base32chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";

// Helper functions
function leftPad(str, len, pad) {
  if (len + 1 >= str.length) {
    str = Array(len + 1 - str.length).join(pad) + str;
  }
  return str;
}

function base32ToHex(base32) {
  base32 = base32.replace(/=/g, "").toUpperCase();
  let bits = "";
  let hex = "";

  for (let i = 0; i < base32.length; i++) {
    const val = base32chars.indexOf(base32.charAt(i));
    if (val === -1) {
      console.error("Invalid Base32 character:", base32.charAt(i));
      throw new Error("Invalid Base32 character");
    }
    bits += leftPad(val.toString(2), 5, "0");
  }

  while (bits.length % 8 !== 0) {
    bits += "0";
  }

  for (let j = 0; j < bits.length; j += 8) {
    const byte = bits.substr(j, 8);
    const hexByte = parseInt(byte, 2).toString(16).padStart(2, "0");
    hex += hexByte;
  }

  return hex;
}

function dec2hex(s) {
  return (s < 15.5 ? "0" : "") + Math.round(s).toString(16);
}

function hex2dec(s) {
  return parseInt(s, 16);
}

function getSwalTheme() {
  const isDark = document.documentElement.classList.contains("dark");
  return {
    background: isDark ? "#1F2937" : "#ffffff",
    confirmButtonColor: "#0c36cf",
    cancelButtonColor: "#6B7280",
    color: isDark ? "#ffffff" : "#1F2937",
  };
}

// TOTP Controller
export default class TotpController extends Controller {
  static targets = [
    "accountName",
    "secretKey",
    "tokensContainer",
    "notification",
  ];

  connect() {
    this.showAccounts();
    this.updateCodes();
    this.startTimer();
  }

  startTimer() {
    this.timer = setInterval(() => {
      this.updateCodes();
    }, 1000);
  }

  disconnect() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  closeNotification() {
    if (this.hasNotificationTarget) {
      this.notificationTarget.style.display = "none";
    }
  }

  async addAccount() {
    const name = this.accountNameTarget.value.trim();
    const secret = this.secretKeyTarget.value.replace(/\s/g, "").toUpperCase();

    if (name === "" || secret === "") {
      await Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "Please fill in all columns",
        ...getSwalTheme(),
      });
      return;
    }

    try {
      this.calcOTP(secret);
    } catch (e) {
      await Swal.fire({
        icon: "error",
        title: "Invalid Secret Key",
        text: e.message,
        ...getSwalTheme(),
      });
      return;
    }

    let accounts = JSON.parse(localStorage.getItem("gauth") || "[]");
    const existingIndex = accounts.findIndex((acc) => acc.name === name);

    if (existingIndex !== -1) {
      const result = await Swal.fire({
        icon: "question",
        title: "Account Exists",
        text: "An account with the same name already exists. Do you want to update it?",
        showCancelButton: true,
        confirmButtonText: "Yes, update it",
        cancelButtonText: "No, keep it",
        ...getSwalTheme(),
      });

      if (!result.isConfirmed) {
        return;
      }
      accounts.splice(existingIndex, 1);
    }

    accounts.push({ name, secret });
    localStorage.setItem("gauth", JSON.stringify(accounts));

    this.accountNameTarget.value = "";
    this.secretKeyTarget.value = "";

    await Swal.fire({
      icon: "success",
      title: "Success",
      text: "Account has been added successfully!",
      timer: 1500,
      showConfirmButton: false,
      ...getSwalTheme(),
    });

    this.showAccounts();
    this.updateCodes();
  }

  async clearData() {
    const result = await Swal.fire({
      icon: "warning",
      title: "Are you sure?",
      text: "This will delete all your accounts. This action cannot be undone!",
      showCancelButton: true,
      confirmButtonText: "Yes, delete all",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#EF4444",
      ...getSwalTheme(),
    });

    if (result.isConfirmed) {
      localStorage.removeItem("gauth");
      this.showAccounts();

      await Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: "All accounts have been deleted.",
        timer: 1500,
        showConfirmButton: false,
        ...getSwalTheme(),
      });
    }
  }

  async deleteAccount(event) {
    const index = parseInt(event.currentTarget.dataset.index);
    const accounts = JSON.parse(localStorage.getItem("gauth") || "[]");
    const account = accounts[index];

    const result = await Swal.fire({
      icon: "warning",
      title: "Delete Account",
      text: `Are you sure you want to delete "${account.name}"?`,
      showCancelButton: true,
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#EF4444",
      ...getSwalTheme(),
    });

    if (result.isConfirmed) {
      accounts.splice(index, 1);
      localStorage.setItem("gauth", JSON.stringify(accounts));
      this.showAccounts();

      await Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: "The account has been deleted.",
        timer: 1500,
        showConfirmButton: false,
        ...getSwalTheme(),
      });
    }
  }

  showAccounts() {
    const accounts = JSON.parse(localStorage.getItem("gauth") || "[]");

    if (accounts.length === 0) {
      this.tokensContainerTarget.innerHTML = `
                        <div class="bg-blue-100 dark:bg-blue-900 border border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-300 px-4 py-3 rounded mb-4 text-center">
                            No accounts added yet
                        </div>
                    `;
      return;
    }

    this.tokensContainerTarget.innerHTML = accounts
      .map(
        (account, index) => `
                    <div class="bg-white dark:bg-gray-800 shadow-md rounded-lg mb-4 overflow-hidden">
                        <div class="p-6">
                            <div class="flex items-center justify-between mb-4">
                                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">${this.escapeHtml(
                                  account.name
                                )}</h3>
                                <button 
                                    data-index="${index}" 
                                    data-action="click->totp#deleteAccount"
                                    class="clickable text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400 transition-colors duration-200"
                                >
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                                    </svg>
                                </button>
                            </div>
                            <div class="text-center">
                                <div class="font-mono text-3xl font-bold text-gray-900 dark:text-white tracking-widest mb-4" id="token-${index}">
                                    ------
                                </div>
                                <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                    <div 
                                        id="progress-${index}" 
                                        class="bg-blue-600 h-2 rounded-full transition-all duration-1000 ease-linear"
                                        style="width: 100%"
                                    ></div>
                                </div>
                            </div>
                        </div>
                    </div>
                `
      )
      .join("");
  }

  escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  calcOTP(secret) {
    try {
      const key = base32ToHex(secret);
      const epoch = Math.round(new Date().getTime() / 1000.0);
      const time = leftPad(dec2hex(Math.floor(epoch / 30)), 16, "0");

      // Use jsSHA for proper HMAC-SHA1
      const hmacObj = new jsSHA(time, "HEX");
      const hmac = hmacObj.getHMAC(key, "HEX", "SHA-1", "HEX");

      const offset = hex2dec(hmac.substring(hmac.length - 1));
      const otp = (hex2dec(hmac.substr(offset * 2, 8)) & 0x7fffffff) + "";

      return otp.substr(otp.length - 6, 6);
    } catch (e) {
      console.error("Error calculating OTP:", e);
      console.error("Secret:", secret);
      return "Error";
    }
  }

  getTimeRemaining() {
    const epoch = Math.round(new Date().getTime() / 1000.0);
    const countDown = 30 - (epoch % 30);
    return countDown > 0 ? countDown : 30;
  }

  updateCodes() {
    const accounts = JSON.parse(localStorage.getItem("gauth") || "[]");
    const remaining = this.getTimeRemaining();
    const percentage = (remaining / 30) * 100;

    accounts.forEach((account, index) => {
      try {
        const token = this.calcOTP(account.secret);
        const tokenElement = document.getElementById(`token-${index}`);
        const progressElement = document.getElementById(`progress-${index}`);

        if (tokenElement) {
          tokenElement.textContent = token;
        }
        if (progressElement) {
          progressElement.style.width = `${percentage}%`;

          // Change color when time is running out
          if (remaining <= 10) {
            progressElement.className = progressElement.className.replace(
              "bg-blue-600",
              "bg-red-500"
            );
          } else {
            progressElement.className = progressElement.className.replace(
              "bg-red-500",
              "bg-blue-600"
            );
          }
        }
      } catch (e) {
        const tokenElement = document.getElementById(`token-${index}`);
        if (tokenElement) {
          tokenElement.textContent = "Error";
        }
        console.error("Error updating token for account " + index, e);
      }
    });
  }
}

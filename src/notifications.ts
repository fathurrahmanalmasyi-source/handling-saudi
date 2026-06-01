
export const requestNotificationPermission = async () => {
  if (!("Notification" in window)) {
    console.warn("Notification not supported");
    return;
  }
  
  const permission = await Notification.requestPermission();
  if (permission === 'granted') {
    // Request other permissions that need user gesture
    if (navigator.mediaDevices) {
        try {
            await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        } catch (e) {
            console.error("Camera/Audio needed", e);
        }
    }
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(() => {}, (e) => console.log(e));
    }
  }
};

export const showNotification = (title: string, body: string, onClickPath?: string) => {
  if (!("Notification" in window)) return;
  
  if (Notification.permission === 'granted') {
    const notification = new Notification(title, { body });
    if (onClickPath) {
      notification.onclick = () => {
        window.location.href = onClickPath; // Note: simple navigation
      };
    }
  }
};

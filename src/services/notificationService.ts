export const notificationService = {
  async requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      console.log('Deze browser ondersteunt geen notificaties');
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }

    return false;
  },

  async scheduleReminder(time: string): Promise<void> {
    const hasPermission = await this.requestPermission();
    if (!hasPermission) return;

    const [hours, minutes] = time.split(':').map(Number);
    const now = new Date();
    const reminderTime = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      hours,
      minutes
    );

    // Als de tijd al voorbij is, plan voor morgen
    if (reminderTime < now) {
      reminderTime.setDate(reminderTime.getDate() + 1);
    }

    const timeUntilReminder = reminderTime.getTime() - now.getTime();
    
    setTimeout(() => {
      new Notification('Urenregistratie Herinnering', {
        body: 'Vergeet niet je uren in te vullen voor vandaag!',
        icon: '/logo192.png'
      });
      
      // Plan voor morgen
      this.scheduleReminder(time);
    }, timeUntilReminder);
  },

  async cancelReminders(): Promise<void> {
    // In een echte app zouden we hier de geplande notificaties annuleren
    // Voor nu is dit een placeholder
    console.log('Herinneringen geannuleerd');
  }
}; 
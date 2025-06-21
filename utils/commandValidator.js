
// Command validation utility
module.exports = {
  validateCommand: function(command) {
    if (!command || typeof command !== 'object') {
      return { valid: false, error: 'Command is not an object' };
    }
    
    if (!command.config) {
      return { valid: false, error: 'Command missing config' };
    }
    
    if (!command.config.name || typeof command.config.name !== 'string') {
      return { valid: false, error: 'Command missing valid name' };
    }
    
    if (!command.run || typeof command.run !== 'function') {
      return { valid: false, error: 'Command missing run function' };
    }
    
    return { valid: true };
  },
  
  validateEvent: function(event) {
    if (!event || typeof event !== 'object') {
      return { valid: false, error: 'Event is not an object' };
    }
    
    if (!event.config) {
      return { valid: false, error: 'Event missing config' };
    }
    
    if (!event.config.name || typeof event.config.name !== 'string') {
      return { valid: false, error: 'Event missing valid name' };
    }
    
    if (!event.run || typeof event.run !== 'function') {
      return { valid: false, error: 'Event missing run function' };
    }
    
    return { valid: true };
  }
};

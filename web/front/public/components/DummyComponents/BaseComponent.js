class BaseComponent {
  classes;
  attrs;
  innerText;
  innerComponents;

  constructor(attrs = {}, classes = [], innerText = "", innerComponents = []) {
    this.attrs = attrs;
    this.classes = classes;
    this.innerText = innerText;
    this.innerComponents = innerComponents;
  }

  toggleText(newInnerText = "") {
    this.innerText = newInnerText;
  }

  addInnerComponent(newComponent, place = 1) {
    if (place === 1) {
      this.innerComponents.push(newComponent);
    } else {
      this.innerComponents.unshift(newComponent);
    }
  }

  removeInnerComponent(place = 1, count = 1) {
    if (count === -1) {
      this.innerComponents = [];
    } else if (place === 1) {
      this.innerComponents.pop();
    } else {
      this.innerComponents.shift();
    }
  }

  getAttr(attr) {
    return this.attrs[attr];
  }

  toggleAttr(attr, value, force = 0) {
    switch (force) {
      case -1:
        delete this.attrs[attr];
        break;
      case 1:
        this.attrs[attr] = value;
        break;
      case 0:
        if (attr in this.attrs) {
          delete this.attrs[attr];
        } else {
          this.attrs[attr] = value;
        }
    }
  }

  toggleClass(componentClass, force = 0) {
    const place = this.classes.indexOf(componentClass);

    switch (force) {
      case -1:
        if (place !== -1) {
          this.classes.splice(place, 1);
        }

        break;
      case 1:
        if (place === -1) {
          this.classes.push(componentClass);
        }

        break;
      case 0:
        if (place === -1) {
          this.classes.push(componentClass);
        } else {
          this.classes.splice(place, 1);
        }
    }
  }

  update() {
    const component = document.getElementById(this.attrs.id);

    if (!component) {
      this.render();
      return;
    }

    const componentAttrs = component.attributes;
    const componentClasses = Array.from(component.classList);

    for (const key of Object.keys(componentAttrs)) {
      if (!(key in this.attrs)) {
        component.removeAttribute(key);
      }
    }

    for (let [key, value] of Object.entries(this.attrs)) {
      component.setAttribute(key, String(value));
    }

    for (let i of componentClasses) {
      if (!this.classes.includes(i)) {
        component.classList.remove(i);
      }
    }

    for (let i of this.classes) {
      component.classList.add(i);
    }
  }

  render() {
    console.log("Parent's render");
  }

  addListeners(events) {
    const component = document.getElementById(this.componentAttrs.id);

    events.forEach(({ event, func }) => {
      component?.addEventListener(event, func);
    });
  }
}

export default BaseComponent;

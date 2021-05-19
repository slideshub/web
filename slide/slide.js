import Component from "../common/Component.js";
import TemplatesManager from "../common/TemplatesManager.js";
import Toast from "../common/Toast.js";
import SlidesAPI from "./slidesAPI.js";

export default class Slide extends Component {
  slide = null;

  node = null;

  references = null;

  constructor(props) {
    super();

    this.presentation_id = props.presentation_id
    this.slide_id = props.slide_id;
    this.slide = props.slide;

    this.props = props;
  }

  async saveChanges() {
    this.slide.nombre = this.node.querySelector(".slide-name-input").value;

    let sizeX = Number(this.node.querySelector("#slide_size_x_input").value);
    sizeX = isNaN(sizeX) ? 800 : sizeX;
    let sizeY = Number(this.node.querySelector("#slide_size_y_input").value);
    sizeY = isNaN(sizeY) ? 600 : sizeY;
    this.slide.detalles.tamanno = `${sizeX}x${sizeY}`;

    this.slide.detalles.contenido =
      this.node.querySelector(".tinymceContainer").innerHTML;

    this.slide.detalles.borde.ancho =
      this.node.querySelector("#borderWitdh").value;
    this.slide.detalles.borde.redondeo =
      this.node.querySelector("#borderRadius").value;
    this.slide.detalles.borde.color =
      this.node.querySelector("#borderColor").value;
    this.slide.detalles.fondo.color = this.node.querySelector("#bgColor").value;

    if (this.node.querySelector("#bgColor2Checkbox").checked) {
      this.slide.detalles.fondo.color2 =
        this.node.querySelector("#bgColor2").value;
    } else {
      this.slide.detalles.fondo.color2 = undefined;
    }
    this.slide.detalles.transicion =
      this.node.querySelector("#transitionSelect").value;

    console.log(this.slide);

    const slide = await SlidesAPI.modifySlide(this.slide_id, this.slide);
    if (slide != undefined) {
      slide.detalles = JSON.parse(slide.detalles);
      this.slide = slide;
      Toast.open("Se han guardado los cambios", "success");
    }

    this.props.refresh(this.slide_id);
  }

  configureEventListeners() {
    // Toolbar
    this.node
      .querySelector("#save_slide")
      .addEventListener("click", this.saveChanges.bind(this));

    const chageSize = (e) => {
      const sizeX = this.node.querySelector("#slide_size_x_input").value;
      const sizeY = this.node.querySelector("#slide_size_y_input").value;
      this.node.querySelector(
        ".slide-edit-container"
      ).style = `--sizeX: ${sizeX}; --sizeY: ${sizeY}`;
    };
    this.node
      .querySelector("#slide_size_x_input")
      .addEventListener("keyup", chageSize.bind(this));
    this.node
      .querySelector("#slide_size_y_input")
      .addEventListener("keyup", chageSize.bind(this));

    // Details
    const slideContainer = this.node.querySelector(".tinymceContainer");

    //BORDER

    this.node.querySelector("#borderWitdh").addEventListener("change", (e) => {
      slideContainer.style.borderWidth = e.target.value;
    });

    this.node.querySelector("#borderRadius").addEventListener("change", (e) => {
      slideContainer.style.borderRadius = e.target.value;
    });

    this.node.querySelector("#borderColor").addEventListener("change", (e) => {
      slideContainer.style.borderColor = e.target.value;
    });

    //BACKGROUND

    this.node.querySelector("#bgColor").addEventListener("change", (e) => {
      slideContainer.style.backgroundColor = e.target.value;
      if (secondColorContainer.getAttribute("disabled") != "true") {
        slideContainer.style.backgroundImage = `linear-gradient(to right, ${
          e.target.value
        } , ${this.node.querySelector("#bgColor2").value})`;
      }
    });

    const secondColorContainer = this.node.querySelector("#bgColor2Container");
    const secondColorInput = this.node.querySelector("#bgColor2");

    this.node
      .querySelector("#bgColor2Checkbox")
      .addEventListener("change", (e) => {
        secondColorContainer.setAttribute("disabled", !e.target.checked);
        e.target.checked
          ? secondColorInput.removeAttribute("disabled")
          : secondColorInput.setAttribute("disabled", "true");
        if (e.target.checked == true) {
          slideContainer.style.backgroundImage = `linear-gradient(to right, ${
            this.node.querySelector("#bgColor").value
          } , ${this.node.querySelector("#bgColor2").value})`;
        } else {
          slideContainer.style.backgroundImage = ``;
        }
      });

    this.node.querySelector("#bgColor2").addEventListener("change", (e) => {
      if (secondColorContainer.getAttribute("disabled") != "true") {
        slideContainer.style.backgroundImage = `linear-gradient(to right, ${
          this.node.querySelector("#bgColor").value
        } , ${e.target.value})`;
      }
    });

    // ADDING REFERENCES
    this.node.querySelector('#add_reference').addEventListener('click', (() => {
        const value = this.node.querySelector('#new_reference_input').value
        if(value != '' && Number(value) != NaN){
            SlidesAPI.addSlideReferences(this.slide_id, value).then((response) => {
                if(response){
                    Toast.open('Referencia agregada', 'success')
                    this.chargeReferences()
                }
            })
        }
    }).bind(this))
  }

  setProperties() {
    if (!this.slide.detalles.borde) {
      this.slide.detalles.borde = {};
    }
    if (this.slide.detalles.borde.ancho) {
      this.node.querySelector("#borderWitdh").value =
        this.slide.detalles.borde.ancho;
      const e = new Event("change");
      const element = this.node.querySelector("#borderWitdh");
      element.dispatchEvent(e);
    } else {
      this.slide.detalles.borde.ancho =
        this.node.querySelector("#borderWitdh").value;
    }

    if (this.slide.detalles.borde.redondeo) {
      this.node.querySelector("#borderRadius").value =
        this.slide.detalles.borde.redondeo;
      const e = new Event("change");
      const element = this.node.querySelector("#borderRadius");
      element.dispatchEvent(e);
    } else {
      this.slide.detalles.borde.redondeo =
        this.node.querySelector("#borderRadius").value;
    }

    if (this.slide.detalles.borde.color) {
      this.node.querySelector("#borderColor").value =
        this.slide.detalles.borde.color;
      const e = new Event("change");
      const element = this.node.querySelector("#borderColor");
      element.dispatchEvent(e);
    } else {
      this.slide.detalles.borde.color =
        this.node.querySelector("#borderColor").value;
    }

    //BACKGROUND

    if (!this.slide.detalles.fondo) {
      this.slide.detalles.fondo = {};
    }

    if (this.slide.detalles.fondo.color) {
      this.node.querySelector("#bgColor").value =
        this.slide.detalles.fondo.color;
      const e = new Event("change");
      const element = this.node.querySelector("#bgColor");
      element.dispatchEvent(e);
    } else {
      this.slide.detalles.fondo.color =
        this.node.querySelector("#bgColor").value;
    }

    if (this.slide.detalles.fondo.color2) {
      this.node.querySelector("#bgColor2Checkbox").checked = true;
      let e = new Event("change");
      let element = this.node.querySelector("#bgColor2Checkbox");
      element.dispatchEvent(e);

      this.node.querySelector("#bgColor2").value =
        this.slide.detalles.fondo.color2;
      e = new Event("change");
      element = this.node.querySelector("#bgColor2");
      element.dispatchEvent(e);
    }

    if (this.slide.detalles.transicion) {
      this.node.querySelector("#transitionSelect").value =
        this.slide.detalles.transicion;
    } else {
      this.slide.detalles.transicion =
        this.node.querySelector("#transitionSelect").value;
    }

    this.chargeReferences();
  }

  async chargeReferences() {
    const references = await SlidesAPI.getSlideReferences(this.slide_id);
    if (references != undefined) {
      const container = this.node.querySelector(".slide-edit-links");
      container.innerHTML = ''
      references.forEach((reference) => {
        const newChild = document.createElement("div");
        newChild.innerHTML = `         
            <span>Id slide: ${reference.id_lamina_referenciada} 
                <br>Nombre: ${reference.nombre_referencia} 
                <br>Presentación: ${reference.nombre_presentacion_referenciada}</span>
            <button id="delete_reference">
                <i class="far fa-trash-alt"></i>
            </button>
        `;

        container.appendChild(newChild);

        newChild.querySelector('#delete_reference').addEventListener('click', (() => {
            SlidesAPI.deleteSlideReference(this.slide_id, reference.id_lamina_referenciada).then((response) => {
                if(response){
                    Toast.open("Se ha eliminado la referencia", 'success')
                    this.chargeReferences()
                }
            })
        }).bind(this))

      });
    }
  }

  configureTinyMCE(sizeX, sizeY) {
    const configTinyMCE = {
      id: this.slide_id,
      target: this.node.querySelector(".tinymceContainer"),
      resize: false,
      menubar: false,
      inline: true,
      plugins: ["link", "lists", "autolink"],
      toolbar: [
        "undo redo | bold italic underline | fontselect fontsizeselect forecolor backcolor | alignleft aligncenter alignright alignfull | numlist bullist outdent indent | link",
      ],
    };

    this.node.querySelector(
      ".slide-edit-container"
    ).style = `--sizeX: ${sizeX}; --sizeY: ${sizeY}`;

    this.node.querySelector(".tinymceContainer").innerHTML = this.slide.detalles
      .contenido
      ? this.slide.detalles.contenido
      : "";

    setTimeout(() => {
      tinymce.init(configTinyMCE);
    }, 1000);
  }

  async render() {
    if (this.slide == null)
      this.slide = await SlidesAPI.getSlide(this.slide_id, true);
    if (this.slide) {
      let sizeX = 800;
      let sizeY = 600;
      if (this.slide.detalles == null) {
        this.slide.detalles = {};
      }
      if (this.slide && this.slide.detalles != null) {
        sizeX = this.slide.detalles.tamanno
          ? Number(this.slide.detalles.tamanno.split("x")[0])
          : sizeX;
        sizeY = this.slide.detalles.tamanno
          ? Number(this.slide.detalles.tamanno.split("x")[1])
          : sizeY;
      } else {
        this.slide.detalles.tamanno = `${sizeX}x${sizeY}`;
      }
      this.node = await TemplatesManager.get("slide/slide", {
        slide: this.slide,
        sizeX,
        sizeY,
        presentation_id: this.presentation_id
      });

      this.configureTinyMCE(sizeX, sizeY);
      this.configureEventListeners();
      this.setProperties();
      return this.node;
    }
    return null;
  }
}

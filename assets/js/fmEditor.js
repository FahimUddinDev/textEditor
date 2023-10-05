class FmEditor {
  constructor({ parentId, toolbar }) {
    this.value = "";
    this.optionsControl = {
      bold: false,
      italic: false,
      underline: false,
      listOl: false,
      listUl: false,
      alignLeft: false,
      alignCenter: false,
      alignRight: false,
      alignJustify: false,
      link: false,
      image: false,
      video: false,
      formula: false,
      codeBlock: false,
      clean: false,
    };
    this.toolsValues = {
      bold: "b",
      italic: "i",
      underline: "u",
    };
    this.parentId = parentId;
    this.toolbarIcons = {
      bold: "./assets/img/icons/bold.svg",
      italic: "./assets/img/icons/italic.svg",
      underline: "./assets/img/icons/underline.svg",
      listOl: "./assets/img/icons/list-ol.svg",
      listUl: "./assets/img/icons/list-ul.svg",
      alignLeft: "./assets/img/icons/align-left.svg",
      alignCenter: "./assets/img/icons/align-center.svg",
      alignRight: "./assets/img/icons/align-right.svg",
      alignJustify: "./assets/img/icons/align-justify.svg",
      link: "./assets/img/icons/link.svg",
      image: "./assets/img/icons/image.svg",
      video: "./assets/img/icons/video.svg",
      formula: "./assets/img/icons/formula.svg",
      codeBlock: "./assets/img/icons/code-block.svg",
      clean: "./assets/img/icons/clean.svg",
    };
    this.toolbar = toolbar || [
      [
        { name: "bold", icon: "./assets/img/icons/bold.svg" },
        "italic",
        "underline",
      ],
      ["listOl", "listUl"],
      ["alignLeft", "alignCenter", "alignRight", "alignJustify"],
      "link",
      "image",
      "video",
      "formula",
      "codeBlock",
      "clean",
    ];
    this.handleToolClick = (title, value) => {
      this.optionsControl[title] = !this.optionsControl[title];
      if (this.optionsControl[title]) {
        this.value = this.value + `< ${value}>`;
      } else {
        this.value = this.value + `</${value}>`;
      }
    };
    this.handleList = (title, value) => {
      this.optionsControl[title] = !this.optionsControl[title];
      if (this.optionsControl[title]) {
        title === "listOl" ? (this.value += `<ol>`) : (this.value += `<ul>`);
      } else {
        title === "listOl" ? (this.value += `</ol>`) : (this.value += `</ul>`);
      }
      const list =
        title === "listOl"
          ? (this.value += `<>`)
          : document.createElement("ul");
    };
    const parent = document.getElementById(parentId);

    this.handleAlignItems = (title, value) => {
      this.optionsControl[title] = !this.optionsControl[title];
    };

    this.handleTools = (title) => {
      if (title === "bold" || title === "italic" || title === "underline") {
        const value = title === "bold" ? "b" : title === "italic" ? "i" : "u";
        this.handleToolClick(title, value);
      } else if (title === "listOl" || title === "listUl") {
        const value = title === "listOl" ? "ol" : "ul";
        this.handleList(title, value);
      } else if (
        title === "alignLeft" ||
        title === "alignCenter" ||
        title === "alignRight" ||
        title === "alignJustify"
      ) {
        const value =
          title === "alignLeft"
            ? "left"
            : title === "alignCenter"
            ? "center"
            : title === "alignRight"
            ? "right"
            : "justify";
        this.handleAlignItems(title, value);
      }
      console.log(this.value);
    };

    // create single element
    const spanNode = (icon, name) => {
      const span = document.createElement("span");
      const img = document.createElement("img");
      img.src = icon;
      const button = document.createElement(`a`);
      button.appendChild(img);
      button.addEventListener("click", () => this.handleTools(name));
      span.appendChild(button);
      return span;
    };

    const toolbarDiv = document.createElement("div");
    // create toolbar
    this.toolbar.map((tool) => {
      // dont want customized anything and dont watn to make group send in string

      if (typeof tool === "string") {
        toolbarDiv.appendChild(spanNode(this.toolbarIcons[tool], tool));
        toolbarDiv.classList.add("fm-icon-wrapper");
      } else if (typeof tool === "object") {
        const toolSection = document.createElement("span");
        toolSection.classList.add("fm-tool-section");
        tool.map((item) => {
          // want to make group send in array
          // want to customized icon send in object with name and icon
          typeof item === "string"
            ? toolSection.appendChild(spanNode(this.toolbarIcons[item], item))
            : toolSection.appendChild(spanNode(item.icon, item.name));
        });
        toolbarDiv.appendChild(toolSection);
      }
    });
    // add editor
    const textBox = document.createElement("textarea");
    textBox.classList.add("fm-text-area");
    textBox.value = this.value;
    textBox.id = "fm-text-box";
    parent.appendChild(toolbarDiv);
    parent.appendChild(textBox);
  }
}

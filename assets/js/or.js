class FmEditor {
  constructor({ parentId, toolbar }) {
    this.value = "<div>";
    this.textSize = "";
    this.activeTag = "";
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
      { textSize: ["14px", "18px", "20px", "25px"], defaultSize: "18px" },
      {
        tagList: ["h1", "h2", "h3", "h4", "h5", "h6", "p", "span"],
        defaultTag: "p",
      },
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
    this.selectedText = {
      first: false,
      selection: false,
      end: false,
    };
    const resetSelection = () => {
      this.selectedText = {
        first: false,
        selection: false,
        end: false,
      };
    };
    this.handleToolClick = (title, value) => {
      this.optionsControl[title] = !this.optionsControl[title];
      if (this.selectedText.selection) {
        this.value =
          this.selectedText.first +
          `<${value}>` +
          this.selectedText.selection +
          `</${value}>` +
          this.selectedText.end;
        resetSelection();
      } else {
        if (this.optionsControl[title]) {
          this.value = this.value + `<${value}>`;
        } else {
          this.value = this.value + `</${value}>`;
        }
      }
    };
    this.handleList = (title, value) => {
      this.optionsControl[title] = !this.optionsControl[title];
      if (this.selectedText.selection) {
        const list = title === "listOl" ? "ol" : "ul";
        const listItem = this.selectedText?.selection?.replaceAll(
          "<br/>",
          "</li> <li>"
        );
        this.value =
          this.selectedText.first +
          `<${list}> <li>` +
          listItem +
          `</li> </${list}>` +
          this.selectedText.end;
        resetSelection();
      } else {
        if (this.optionsControl[title]) {
          title === "listOl"
            ? (this.value = this.value + `<ol> <li>`)
            : (this.value = this.value + `<ul> <li>`);
        } else {
          title === "listOl"
            ? (this.value = this.value + `</li> </ol>`)
            : (this.value = this.value + `</li> </ul>`);
        }
      }
    };
    const parent = document.getElementById(parentId);

    this.handleAlignItems = (title, value) => {
      this.optionsControl[title] = !this.optionsControl[title];
      if (this.selectedText.selection) {
        this.value =
          this.selectedText.first +
          `<span style="text-align: ${value}"; >` +
          this.selectedText.selection +
          `</span>` +
          this.selectedText.end;
        resetSelection();
      } else {
        const stopIndex = this.value.indexOf(">");
        const valueSlice = this.value.slice(0, stopIndex + 1);
        const checkStyle = valueSlice.includes("style");
        const tagSide = valueSlice.indexOf(" ");
        let makeStyle = "";
        if (checkStyle) {
          if (tagSide >= 0) {
            const valueOfStyle = valueSlice.split("=");
            const valueOfStylesElement = valueOfStyle[1].split(";");
            valueOfStylesElement.forEach((element) => {
              if (element.includes("text-align")) {
                makeStyle += `text-align: ${value};`;
              } else {
                const styleOnly = element.replace("'>", "");
                makeStyle += styleOnly;
              }
            });
            if (!makeStyle.includes("text-align")) {
              makeStyle += ` text-align: ${value}`;
            }
          }
        } else {
          makeStyle += `text-align: ${value};`;
        }
        const tag = this.value.indexOf(" ");
        if (tag > 0 && tag < stopIndex) {
          this.value = this.value.replace(
            this.value.slice(0, stopIndex),
            this.value.slice(0, tag) + " style = ' " + makeStyle + "'"
          );
        } else {
          this.value = this.value.replace(
            this.value.slice(0, stopIndex),
            this.value.slice(0, stopIndex) + " style=' " + makeStyle + "'"
          );
        }
      }
    };
    // handle link
    this.submitLink = (title, address, setValue) => {
      const link = `<a href="${address}" >${title}</a>`;
      setValue(link);
      document
        .getElementById(parentId)
        .removeChild(document.getElementById("linkAdd"));
      document.getElementById("fm-text-box").value = this.value;
      document.getElementById("show-demo").innerHTML = this.value;
    };
    this.addLink = (setValue) => {
      // making link input

      const linkElement = document.createElement("div");
      linkElement.style = "position: absolute; top:50px";
      linkElement.id = "linkAdd";
      const titleInput = document.createElement("input");
      const linkInput = document.createElement("input");
      titleInput.type = "text";
      titleInput.placeholder = "Enter button Name";
      titleInput.id = "linkTitle";
      linkInput.type = "text";
      linkInput.placeholder = "Enter Link";
      linkInput.id = "linkAddress";
      const submitBtn = document.createElement("button");
      submitBtn.innerText = "submit";
      submitBtn.addEventListener("click", () => {
        const title = document.getElementById("linkTitle").value;
        const address = document.getElementById("linkAddress").value;
        if (title && address) {
          this.submitLink(title, address, setValue);
        }
      });
      linkElement.appendChild(titleInput);
      linkElement.appendChild(linkInput);
      linkElement.appendChild(submitBtn);
      parent.appendChild(linkElement);
    };

    // add image

    this.submitImage = () => {
      const imgSrc = document.getElementById("imageSrc").value;
      if (imgSrc) {
        const image = `<img src="${imgSrc}" alt="" />`;
        this.value = this.value + image;
        document
          .getElementById(parentId)
          .removeChild(document.getElementById("imageInput"));
        document.getElementById("fm-text-box").value = this.value;
        document.getElementById("show-demo").innerHTML = this.value;
      }
    };

    this.addImage = () => {
      const imageInput = document.createElement("input");
      imageInput.type = "text";
      imageInput.placeholder = "enter image src";
      imageInput.id = "imageSrc";
      const submit = document.createElement("button");
      submit.innerText = "Submit";
      submit.addEventListener("click", this.submitImage);
      const imageParent = document.createElement("div");
      imageParent.style = "position: absolute; top:50px";
      imageParent.id = "imageInput";
      imageParent.appendChild(imageInput);
      imageParent.appendChild(submit);
      parent.appendChild(imageParent);
    };

    // add video
    // add image

    this.submitVideo = () => {
      const videoSrc = document.getElementById("videoSrc").value;
      if (videoSrc) {
        const video = `<iframe src="${videoSrc}" alt="" />`;
        this.value = this.value + video;
        document
          .getElementById(parentId)
          .removeChild(document.getElementById("videoInput"));
        document.getElementById("fm-text-box").value = this.value;
        document.getElementById("show-demo").innerHTML = this.value;
      }
    };

    this.addVideo = () => {
      const videoInput = document.createElement("input");
      videoInput.type = "text";
      videoInput.placeholder = "enter video src";
      videoInput.id = "videoSrc";
      const submit = document.createElement("button");
      submit.innerText = "Submit";
      submit.addEventListener("click", this.submitVideo);
      const videoParent = document.createElement("div");
      videoParent.style = "position: absolute; top:50px";
      videoParent.id = "videoInput";
      videoParent.appendChild(videoInput);
      videoParent.appendChild(submit);
      parent.appendChild(videoParent);
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
      } else if (title === "link") {
        const setValue = (link) => (this.value = this.value + link);
        this.addLink(setValue);
        this.optionsControl.link = !this.optionsControl.link;
      } else if (title === "image") {
        this.addImage();
      } else if (title === "video") {
        this.addVideo();
      } else if (title === "formula") {
        if (!this.optionsControl.formula) {
          this.value = this.value + "<h:math>";
        } else {
          this.value = this.value + "</h:math>";
        }
        this.optionsControl.formula = !this.optionsControl.formula;
      } else if (title === "codeBlock") {
        if (!this.optionsControl.codeBlock) {
          this.value = this.value + "<pre>";
        } else {
          this.value = this.value + "</pre>";
        }
        this.optionsControl.codeBlock = !this.optionsControl.codeBlock;
      } else if (title === "clean") {
        this.value = "";
      }
      document.getElementById("fm-text-box").value = this.value;
      document.getElementById("show-demo").innerHTML = `${this.value} </div>`;
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
        if (tool.tagList) {
          const selectElement = document.createElement("select");
          tool.tagList.forEach((tag, index) => {
            const option = document.createElement("option");
            if (tool.defaultTag) {
              if (tool.defaultTag === tag) {
                option.selected = true;
                this.value = this.value + `<${tag}>`;
                this.activeTag = tag;
              }
            } else if (tool.tagList.includes("p")) {
              if (tag === "p") {
                option.selected = true;
                this.value = this.value + "<p>";
                this.activeTag = "p";
              }
            } else if (index === 0) {
              option.selected = true;
              this.value = this.value + `<${tag}>`;
              this.activeTag = tag;
            }
            option.value = tag;
            switch (tag) {
              case "h1":
                option.innerText = "Heading 1";
                break;
              case "h2":
                option.innerText = "Heading 2";
                break;
              case "h3":
                option.innerText = "Heading 3";
                break;
              case "h4":
                option.innerText = "Heading 4";
                break;
              case "h5":
                option.innerText = "Heading 5";
                break;
              case "h6":
                option.innerText = "Heading 6";
                break;
              case "p":
                option.innerText = "Paragraph";
                break;
              case "span":
                option.innerText = "Span";
                break;
              default:
                option.innerText = tag;
            }
            selectElement.appendChild(option);
          });
          selectElement.id = "tagSelection";
          selectElement.addEventListener("change", (event) => {
            if (this.activeTag) {
              this.value = this.value + `</${this.activeTag}>`;
            }
            this.activeTag = event.target.value;
            this.value = this.value + `<${this.activeTag}>`;
            document.getElementById("fm-text-box").value = this.value;
            document.getElementById("show-demo").innerHTML = this.value;
          });
          toolbarDiv.appendChild(selectElement);
        } else if (tool.textSize) {
          const selectElement = document.createElement("select");
          tool.textSize.forEach((size, index) => {
            const option = document.createElement("option");
            if (tool.defaultSize) {
              if (tool.defaultSize === size) {
                option.selected = true;
                // this.value = this.value + `<${size}>`;
                this.textSize = size;
              }
            } else if (tool.tagList.includes("18px")) {
              if (size === "18px") {
                option.selected = true;
                // this.value = this.value + "<p>";
                this.textSize = "18px";
              }
            } else if (index === 0) {
              option.selected = true;
              // this.value = this.value + `<${size}>`;
              this.activeTag = size;
            }
            option.value = size;
            option.innerText = size;
            selectElement.appendChild(option);
          });
          selectElement.id = "textSizeSelection";
          selectElement.addEventListener("change", (event) => {
            if (this.selectedText.selection) {
              const addedSize = `<span style="font-size : ${event.target.value}">${this.selectedText.selection}</span>`;
              this.value =
                this.selectedText.first + addedSize + this.selectedText.end;
              resetSelection();
            } else {
              if (this.textSize === "") {
                this.value =
                  this.value +
                  `<span style="font-size: ${event.target.value}">`;
              } else {
                this.value =
                  this.value +
                  `</span> <span style="font-size: ${event.target.value}">`;
              }
              this.textSize = event.target.value;
            }
            document.getElementById("fm-text-box").value = this.value;
            document.getElementById("show-demo").innerHTML = this.value;
          });
          toolbarDiv.appendChild(selectElement);
        } else {
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
      }
    });

    // trim extra white space
    this.trimSpace = () => {
      this.value = this.value
        .split(" ")
        .filter((word) => word !== "")
        .join(" ");
    };

    this.handleChange = (e) => {
      this.value = e.target.value;

      // handle when need new li
      if (e.key === "Enter") {
        const ol = this.value.lastIndexOf("<ol>");
        const isClosedOl = ol > this.value.lastIndexOf("</ol>");
        const ul = this.value.lastIndexOf("<ul>");
        const isClosedUl = ul > this.value.lastIndexOf("</ul>");

        if (isClosedOl || isClosedUl) {
          this.value = this.value + "</li> <li>";
        } else {
          this.value = this.value + "<br/>";
        }
      }
      const emptyLi = this.value.indexOf("<li></li>");
      if (emptyLi > 0) {
        this.value = this.value.replace("<li></li>", "");
      }

      document.getElementById("fm-text-box").value = this.value;
      document.getElementById("show-demo").innerHTML = this.value;
    };

    // handle Selection
    this.handleSelection = (e) => {
      if (e.target.selectionStart !== 0) {
        const startPos = e.target.selectionStart;
        const endPos = e.target.selectionEnd;

        let first = this.value.substring(0, startPos);
        let selection = this.value.substring(startPos, endPos);
        let end = this.value.substring(endPos);
        this.selectedText = {
          first,
          selection,
          end,
        };
      }
      this.trimSpace();
    };

    // add editor
    const textBox = document.createElement("textarea");
    textBox.classList.add("fm-text-area");
    textBox.value = this.value;
    textBox.addEventListener("keyup", (event) => {
      this.handleChange(event);
    });

    textBox.addEventListener("mouseup", (event) => this.handleSelection(event));
    textBox.id = "fm-text-box";
    // show demo
    const showDemo = document.createElement("span");
    showDemo.id = "show-demo";
    showDemo.class = "fm-text-box-demo";
    showDemo.style = "width:100%; background:green";
    parent.appendChild(toolbarDiv);
    parent.appendChild(showDemo);
    parent.appendChild(textBox);
  }
}

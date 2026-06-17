(function () {
  function getField(form, name) {
    return Array.from(form.elements).find(function (element) {
      return element.name === name;
    });
  }

  function setFieldValue(field, value) {
    if (!field) return;
    if (field.type === "checkbox") {
      field.checked = Boolean(value);
    } else {
      field.value = String(value);
    }
    field.dispatchEvent(new Event("input", { bubbles: true }));
    field.dispatchEvent(new Event("change", { bubbles: true }));
  }

  function flashForm(form) {
    form.classList.remove("ops-form-updated");
    void form.offsetWidth;
    form.classList.add("ops-form-updated");
  }

  document.addEventListener("click", function (event) {
    var button = event.target.closest("[data-ops-fill], [data-ops-exp-multiplier], [data-ops-active-state]");
    if (!button) return;

    var form = button.closest("form");
    if (!form) return;

    var fill = button.getAttribute("data-ops-fill");
    if (fill) {
      try {
        var values = JSON.parse(fill);
        Object.keys(values).forEach(function (name) {
          setFieldValue(getField(form, name), values[name]);
        });
        flashForm(form);
      } catch (error) {
        console.warn("Invalid ops fill payload", error);
      }
      return;
    }

    var multiplier = button.getAttribute("data-ops-exp-multiplier");
    if (multiplier) {
      var rate = Number(multiplier);
      if (!Number.isFinite(rate)) return;
      form.querySelectorAll(".ops-exp-field input").forEach(function (input) {
        var current = Number(input.value || "0");
        input.value = String(Math.max(0, Math.round(current * rate)));
        input.dispatchEvent(new Event("input", { bubbles: true }));
        input.dispatchEvent(new Event("change", { bubbles: true }));
      });
      flashForm(form);
      return;
    }

    var activeState = button.getAttribute("data-ops-active-state");
    if (activeState !== null) {
      var checked = activeState === "true";
      form.querySelectorAll(".ops-active-field input[type='checkbox']").forEach(function (input) {
        input.checked = checked;
        input.dispatchEvent(new Event("change", { bubbles: true }));
      });
      flashForm(form);
    }
  });
})();

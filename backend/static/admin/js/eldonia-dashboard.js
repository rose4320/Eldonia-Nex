(function () {
  "use strict";

  var root = document.getElementById("ops-dashboard");
  if (!root) return;

  var statsUrl = root.getAttribute("data-stats-url");
  var refreshBtn = document.getElementById("ops-refresh-btn");
  var updatedAt = document.getElementById("ops-updated-at");
  var timer = null;

  function setMetric(path, value) {
    var nodes = root.querySelectorAll('[data-metric="' + path + '"]');
    nodes.forEach(function (node) {
      if (path.indexOf("gmv") !== -1 || path.indexOf("paid") !== -1 || path.indexOf("total_paid") !== -1 || path.indexOf("estimated_total") !== -1) {
        node.textContent = value.indexOf("¥") === 0 ? value : "¥" + value;
      } else {
        node.textContent = value;
      }
    });
  }

  function applyMetrics(data) {
    if (updatedAt && data.updated_at) {
      var parts = data.updated_at.split(" ");
      updatedAt.textContent = parts.length > 1 ? parts[1] : data.updated_at;
    }
    if (data.users) {
      setMetric("users.total", data.users.total);
      setMetric("users.active", data.users.active);
      setMetric("users.online_24h", data.users.online_24h);
      setMetric("users.new_today", data.users.new_today);
      setMetric("users.new_7d", data.users.new_7d);
    }
    if (data.sales) {
      setMetric("sales.gmv_month", data.sales.gmv_month);
      setMetric("sales.gmv_today", data.sales.gmv_today);
      setMetric("sales.orders_today", data.sales.orders_today);
      setMetric("sales.orders_completed", data.sales.orders_completed);
      setMetric("sales.sales_index", data.sales.sales_index);
    }
    if (data.fees) {
      setMetric("fees.estimated_total_mtd", data.fees.estimated_total_mtd);
    }
    if (data.referrals) {
      setMetric("referrals.total_paid", data.referrals.total_paid);
      setMetric("referrals.paid_month", data.referrals.paid_month);
      setMetric("referrals.count_paid", data.referrals.count_paid);
      setMetric("referrals.active_codes", data.referrals.active_codes);
      setMetric("referrals.conversions", data.referrals.conversions);
    }
    if (data.quest) {
      setMetric("quest.active_actions", data.quest.active_actions);
      setMetric("quest.active_achievements", data.quest.active_achievements);
      setMetric("quest.xp_today", data.quest.xp_today);
      setMetric("quest.xp_7d", data.quest.xp_7d);
      setMetric("quest.achievements_completed", data.quest.achievements_completed);
    }
  }

  function refresh() {
    if (!statsUrl) return;
    fetch(statsUrl, { credentials: "same-origin", headers: { Accept: "application/json" } })
      .then(function (res) { return res.json(); })
      .then(applyMetrics)
      .catch(function () { /* ignore */ });
  }

  if (refreshBtn) {
    refreshBtn.addEventListener("click", refresh);
  }

  timer = window.setInterval(refresh, 60000);
})();

// AgriLoop Self-Contained Interactive Application Script
// Universally compatible with both file:/// (direct browser open) and http:// (local/hosted dev server)

(function () {
  if (window.agriLoopLoaded) return;
  window.agriLoopLoaded = true;
  'use strict';

  // --- HARDWARE COMPONENTS DATA (Calibrated for Actual Field Solution Prototype) ---
  const hardwareComponents = [
    {
      id: 'solar-unit',
      name: 'Solar Photovoltaic Power Unit',
      tag: 'Off-Grid Autonomous Energy',
      role: 'Monocrystalline solar panel mounted on the mast head, coupled with a TP4056 charge controller and lithium battery to power the IoT node 24/7 without grid power.',
      coords: { x: 72, y: 12 },
      specs: [
        { key: 'Solar Panel', val: '6V / 2W – 5W Monocrystalline' },
        { key: 'Battery Chemistry', val: '3.7V 18650 Li-ion / LiFePO4' },
        { key: 'Autonomous Target', val: 'Continuous off-grid field runtime' },
        { key: 'Power Management', val: 'ESP32 deep-sleep duty cycling' }
      ]
    },
    {
      id: 'esp32',
      name: 'ESP32 Weatherproof Enclosure Node',
      tag: 'Edge Compute & Wireless Gateway',
      role: 'IP65 weatherproof field enclosure housing the ESP32 microcontroller, wireless telemetry transceiver, optocoupler relay, and power regulation circuitry.',
      coords: { x: 72, y: 22 },
      specs: [
        { key: 'MCU', val: 'ESP32-WROOM-32 Dual Core 240MHz' },
        { key: 'Enclosure', val: 'IP65 Weatherproof Transparent Casing' },
        { key: 'Wireless Protocol', val: 'Wi-Fi 802.11 b/g/n / ESP-NOW / MQTT' },
        { key: 'Operating Logic', val: 'Automated root-zone moisture thresholding' }
      ]
    },
    {
      id: 'oled',
      name: '0.96" OLED Diagnostic Display',
      tag: 'Local Field Telemetry Interface',
      role: 'On-site digital interface integrated inside the controller housing, displaying live soil moisture % VWC, ambient temperature, humidity, and relay state directly to farmers in the field.',
      coords: { x: 70, y: 21 },
      specs: [
        { key: 'Display Type', val: '0.96" I2C Monochrome OLED' },
        { key: 'Resolution', val: '128 x 64 pixels' },
        { key: 'Interface', val: 'I2C Bus (GPIO21 / GPIO22)' },
        { key: 'Visibility', val: 'High-contrast sunlight readable' }
      ]
    },
    {
      id: 'relay',
      name: 'Relay Irrigation Actuator',
      tag: 'High-Current Solenoid Switch',
      role: 'Galvanically isolated optocoupler relay that switches the DC solenoid valve or water pump on/off based on real-time soil moisture thresholds evaluated by the ESP32.',
      coords: { x: 74, y: 27 },
      specs: [
        { key: 'Switching Rating', val: '10A 250VAC / 30VDC' },
        { key: 'Trigger Logic', val: 'Active LOW via ESP32 GPIO26' },
        { key: 'Isolation', val: 'Optocoupler galvanic protection' },
        { key: 'Actuation Target', val: 'Automatic drip pulsing' }
      ]
    },
    {
      id: 'dht22',
      name: 'Solar-Shielded Microclimate Sensor',
      tag: 'Canopy Temp & Humidity',
      role: 'Louvered solar radiation shield mounted on a vertical mast at crop canopy level, measuring ambient air temperature and relative humidity to evaluate atmospheric vapor pressure deficit.',
      coords: { x: 49, y: 41 },
      specs: [
        { key: 'Sensor Core', val: 'DHT22 / AHT20 high precision' },
        { key: 'Shield Type', val: 'Multi-plate solar radiation louvers' },
        { key: 'Humidity Range', val: '0 – 100% RH (±2% accuracy)' },
        { key: 'Temp Range', val: '-40 to +80 °C (±0.5°C)' }
      ]
    },
    {
      id: 'soil-sensor',
      name: 'Capacitive Soil Moisture Probe',
      tag: 'Sub-Mulch Root-Zone Sensing',
      role: 'Dielectric probe inserted directly into the root-zone soil through plant cutouts, measuring volumetric water content (VWC) continuously without copper corrosion.',
      coords: { x: 41, y: 89 },
      specs: [
        { key: 'Technology', val: 'Capacitive dielectric v1.2 probe' },
        { key: 'Placement', val: 'Root-zone depth (5cm – 15cm)' },
        { key: 'Corrosion', val: 'Corrosion-free (no exposed metal electrolysis)' },
        { key: 'Output', val: 'Analog voltage to 12-bit ADC' }
      ]
    },
    {
      id: 'drip-tubing',
      name: 'Drip Line Irrigation Tubing',
      tag: 'Root-Targeted Micro-Irrigation',
      role: 'Precision micro-drip tubing routed directly along crop beds, delivering calibrated water drops straight to root zones beneath the mulch film to minimize evaporation.',
      coords: { x: 58, y: 62 },
      specs: [
        { key: 'Tubing Type', val: '16mm UV-resistant polyethylene line' },
        { key: 'Emitter', val: 'Pressure-compensating micro drippers' },
        { key: 'Flow Rate', val: '2.0 – 4.0 L/Hour calibrated' },
        { key: 'Hydration Target', val: 'Zero evaporative runoff loss' }
      ]
    },
    {
      id: 'tank',
      name: 'Elevated Irrigation Reservoir Tank',
      tag: 'Gravity-Fed Drip Supply',
      role: 'Elevated water storage tank supplying consistent hydrostatic pressure to the field drip manifold, actuated automatically via the ESP32 solenoid valve.',
      coords: { x: 91, y: 15 },
      specs: [
        { key: 'Configuration', val: 'Elevated gravity-fed head tank' },
        { key: 'Control', val: 'Inline DC solenoid valve' },
        { key: 'Pressure Head', val: 'Constant hydrostatic head' },
        { key: 'Water Supply', val: 'Canal / borewell / harvested storage' }
      ]
    },
    {
      id: 'bio-mulch',
      name: 'Biodegradable Mulch Film Bed',
      tag: 'Water Hyacinth Nanocellulose',
      role: 'Eco-friendly biodegradable mulch film spread over raised ridges, suppressing weed growth, stabilizing soil temperature, and retaining root-zone hydration.',
      coords: { x: 26, y: 66 },
      specs: [
        { key: 'Composition', val: 'Water Hyacinth nanocellulose + chitosan matrix' },
        { key: 'Target Functional Period', val: '90–120 days*' },
        { key: 'Degradation', val: 'Microbial mineralization into organic humus' },
        { key: 'Environmental Impact', val: 'Zero microplastic soil residues' }
      ]
    }
  ];

  // --- MULCH CHEMICAL & BIOLOGICAL COMPONENTS ---
  const mulchComponents = [
    {
      name: 'Chitosan',
      formula: '(C₆H₁₁NO₄)ₙ',
      category: 'bio',
      categoryLabel: 'Biobased / Biological Material',
      origin: 'Deacetylated chitin from crustacean/fungal biomass',
      role: 'Primary film-forming biopolymer Matrix. Imparts intrinsic antimicrobial properties and enhances mechanical tensile strength when complexed with nanocellulose.',
      concentration: 'Proposed: 1.5 – 2.5% w/v'
    },
    {
      name: 'Glycerol',
      formula: 'C₃H₈O₃',
      category: 'bio',
      categoryLabel: 'Biobased / Biological Material',
      origin: 'Plant lipid / vegetable biodiesel byproduct',
      role: 'Green plasticizer. Reduces intermolecular hydrogen bonding between cellulose chains, increasing elongation-at-break and preventing premature film brittleness.',
      concentration: 'Proposed: 20 – 30% w/w dry basis'
    },
    {
      name: 'Citric Acid',
      formula: 'C₆H₈O₇',
      category: 'bio',
      categoryLabel: 'Biobased / Biological Material',
      origin: 'Citrus fermentation product',
      role: 'Non-toxic green crosslinking agent. Forms ester linkages with hydroxyl groups of nanocellulose and chitosan, enhancing moisture barrier resistance.',
      concentration: 'Proposed: 3 – 5% w/w'
    },
    {
      name: 'Beeswax',
      formula: 'C₁₅H₃₁COOC₃₀H₆₁ (Ester complex)',
      category: 'bio',
      categoryLabel: 'Biobased / Biological Material',
      origin: 'Natural apicultural secretion',
      role: 'Hydrophobic lipid additive. Formulated in microscopic emulsion phase to significantly lower Water Vapor Permeability (WVP) for extended field endurance.',
      concentration: 'Proposed: 2 – 5% w/w emulsion'
    },
    {
      name: 'Sodium Hydroxide (NaOH)',
      formula: 'NaOH (Alkali Solution)',
      category: 'chem',
      categoryLabel: 'Processing / Chemical Component',
      origin: 'Standard inorganic chemical reagent',
      role: 'Delignification and hemicellulose solubilization. Breaks ester and ether linkages in raw water hyacinth biomass during initial chemical alkaline pretreatment.',
      concentration: 'Reagent: 2% – 4% w/v at 80°C'
    },
    {
      name: 'Hydrogen Peroxide (H₂O₂)',
      formula: 'H₂O₂ (Oxidizing Agent)',
      category: 'chem',
      categoryLabel: 'Processing / Chemical Component',
      origin: 'Chlorine-free green bleaching reagent',
      role: 'Oxidative lignin decolorization. Bleaches pretreated brown cellulose pulp to yield high-purity white cellulosic fibers without chlorinated dioxin hazards.',
      concentration: 'Reagent: 3% – 5% v/v pH adjusted'
    },
    {
      name: 'Acetic Acid',
      formula: 'CH₃COOH (Dilute Organic Acid)',
      category: 'chem',
      categoryLabel: 'Processing / Chemical Component',
      origin: 'Organic acid processing solvent',
      role: 'Solvent vehicle for protonating chitosan amino groups (-NH₂ to -NH₃⁺), enabling homogenous dispersion and dissolution into the casting solution.',
      concentration: 'Reagent: 1% – 2% v/v aqueous'
    },
    {
      name: 'Sulfuric Acid (H₂SO₄)',
      formula: 'H₂SO₄ (Mineral Acid)',
      category: 'chem',
      categoryLabel: 'Processing / Chemical Component',
      origin: 'Controlled acid hydrolysis reagent',
      role: 'Hydrolyzes amorphous cellulose regions while preserving crystalline domains to extract Cellulose Nanocrystals (CNC) / Nanocellulose fibers. Thoroughly neutralized and washed before film casting.',
      concentration: 'Reagent: 45% – 64% w/w (strictly neutralized post-extraction)'
    }
  ];

  function initApp() {
    // 1. HERO SCENES SWITCHER
    const bgLayers = document.querySelectorAll('.hero-bg-layer');
    const sceneBtns = document.querySelectorAll('.scene-btn');
    if (bgLayers.length && sceneBtns.length) {
      let currentIdx = 0;
      function switchScene(idx) {
        currentIdx = idx;
        bgLayers.forEach((layer, i) => {
          layer.classList.toggle('active', i === currentIdx);
        });
        sceneBtns.forEach((btn, i) => {
          btn.classList.toggle('active', i === currentIdx);
        });
      }

      sceneBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
          const idx = parseInt(btn.dataset.sceneIndex, 10);
          switchScene(idx);
        });
      });

      setInterval(() => {
        const next = (currentIdx + 1) % bgLayers.length;
        switchScene(next);
      }, 7000);
    }

    // 2. IOT DASHBOARD
    const moistureSlider = document.getElementById('moisture-slider');
    const moistureValText = document.getElementById('metric-moisture-val');
    const sliderReadout = document.getElementById('slider-readout');
    const pumpStatusEl = document.getElementById('metric-pump-status');
    const overrideBtn = document.getElementById('override-btn');
    const tempValText = document.getElementById('metric-temp-val');
    const humidityValText = document.getElementById('metric-humidity-val');
    const loopSteps = document.querySelectorAll('.loop-step');

    if (moistureSlider && moistureValText && pumpStatusEl) {
      let currentMoisture = 24.6;
      let isManualOverride = false;
      let manualPumpState = false;
      const THRESHOLD = 30.0;

      function updatePump() {
        let pumpOn = isManualOverride ? manualPumpState : currentMoisture < THRESHOLD;
        if (pumpOn) {
          pumpStatusEl.textContent = 'ON';
          pumpStatusEl.className = 'pump-indicator';
        } else {
          pumpStatusEl.textContent = 'OFF';
          pumpStatusEl.className = 'pump-indicator pump-off';
        }
      }

      moistureSlider.addEventListener('input', (e) => {
        currentMoisture = parseFloat(e.target.value);
        moistureValText.textContent = currentMoisture.toFixed(1);
        if (sliderReadout) {
          sliderReadout.textContent = `${currentMoisture.toFixed(1)}%`;
        }
        updatePump();
      });

      if (overrideBtn) {
        overrideBtn.addEventListener('click', () => {
          isManualOverride = !isManualOverride;
          if (isManualOverride) {
            manualPumpState = pumpStatusEl.textContent !== 'ON';
            overrideBtn.textContent = `MANUAL OVERRIDE: ${manualPumpState ? 'FORCED ON' : 'FORCED OFF'}`;
            overrideBtn.style.borderColor = 'var(--color-amber)';
            overrideBtn.style.color = '#fbbf24';
          } else {
            overrideBtn.textContent = 'MANUAL OVERRIDE: AUTO';
            overrideBtn.style.borderColor = '';
            overrideBtn.style.color = '';
          }
          updatePump();
        });
      }

      // Sensor telemetry natural fluctuations
      setInterval(() => {
        if (tempValText) {
          tempValText.textContent = (29.2 + Math.random() * 0.4).toFixed(1);
        }
        if (humidityValText) {
          humidityValText.textContent = Math.round(67 + Math.random() * 2);
        }
      }, 3500);

      // 4-Stage Closed Loop Animation
      let loopIndex = 0;
      if (loopSteps.length) {
        setInterval(() => {
          loopSteps.forEach((step, i) => {
            step.classList.toggle('active', i === loopIndex);
          });
          loopIndex = (loopIndex + 1) % loopSteps.length;
        }, 2200);
      }

      updatePump();
    }

    // 3. HARDWARE PROTOTYPE HOTSPOTS
    const hotspotsContainer = document.getElementById('hotspots-container');
    const hotspotsNav = document.getElementById('hotspots-nav');
    const titleEl = document.getElementById('component-title');
    const tagEl = document.getElementById('component-tag');
    const roleEl = document.getElementById('component-role');
    const specsContainer = document.getElementById('component-specs');

    if (hotspotsContainer && titleEl) {
      function selectComponent(comp) {
        document.querySelectorAll('.hotspot-pin').forEach(pin => {
          pin.classList.toggle('active', pin.dataset.id === comp.id);
        });
        document.querySelectorAll('.hotspot-nav-pill').forEach(btn => {
          btn.classList.toggle('active', btn.dataset.id === comp.id);
        });

        titleEl.textContent = comp.name;
        tagEl.textContent = comp.tag;
        roleEl.textContent = comp.role;

        if (specsContainer) {
          specsContainer.innerHTML = comp.specs.map(s => `
            <div class="prototype-spec-item">
              <span class="spec-key">${s.key}:</span>
              <span class="spec-val">${s.val}</span>
            </div>
          `).join('');
        }
      }

      hotspotsContainer.innerHTML = '';
      hardwareComponents.forEach(comp => {
        const pin = document.createElement('button');
        pin.className = 'hotspot-pin';
        pin.dataset.id = comp.id;
        pin.style.left = `${comp.coords.x}%`;
        pin.style.top = `${comp.coords.y}%`;
        pin.title = comp.name;
        pin.setAttribute('aria-label', `Inspect ${comp.name}`);
        pin.innerHTML = '<span class="hotspot-pin-inner"></span>';
        pin.addEventListener('click', () => selectComponent(comp));
        hotspotsContainer.appendChild(pin);
      });

      if (hotspotsNav) {
        hotspotsNav.innerHTML = '';
        hardwareComponents.forEach(comp => {
          const btn = document.createElement('button');
          btn.className = 'hotspot-nav-pill';
          btn.dataset.id = comp.id;
          btn.textContent = comp.name.split(' ')[0] + (comp.name.split(' ')[1] ? ' ' + comp.name.split(' ')[1] : '');
          btn.addEventListener('click', () => selectComponent(comp));
          hotspotsNav.appendChild(btn);
        });
      }

      selectComponent(hardwareComponents[0]);
    }

    // 4. MATERIALS SCIENCE FORMULATION MATRIX
    const materialsContainer = document.getElementById('materials-grid');
    const filterTabs = document.querySelectorAll('.filter-tab');

    if (materialsContainer && filterTabs.length) {
      function renderMaterials(filter = 'all') {
        const list = filter === 'all'
          ? mulchComponents
          : mulchComponents.filter(c => c.category === filter);

        materialsContainer.innerHTML = list.map(item => `
          <div class="chem-card fade-in-up appear">
            <span class="chem-tag ${item.category === 'bio' ? 'tag-bio' : 'tag-chem'}">
              ${item.categoryLabel}
            </span>
            <h4 class="chem-name">${item.name}</h4>
            <div class="chem-formula">${item.formula}</div>
            <p class="chem-role">${item.role}</p>
            <div style="margin-top: 10px; font-family: var(--font-mono); font-size: 0.72rem; color: var(--text-muted);">
              Concentration/Role: <span style="color: var(--text-primary);">${item.concentration}</span>
            </div>
          </div>
        `).join('');
      }

      filterTabs.forEach(tab => {
        tab.addEventListener('click', () => {
          filterTabs.forEach(t => t.classList.remove('active'));
          tab.classList.add('active');
          renderMaterials(tab.dataset.filter);
        });
      });

      renderMaterials('all');
    }

    // 5. TIMELINE SCROLL TRIGGER
    const timelineSteps = document.querySelectorAll('.timeline-step');
    if (timelineSteps.length && 'IntersectionObserver' in window) {
      const stepObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            const marker = entry.target.querySelector('.timeline-marker');
            if (marker) {
              marker.style.background = 'var(--color-brand)';
              marker.style.color = '#060e0a';
              marker.style.boxShadow = '0 0 20px rgba(46, 204, 113, 0.6)';
            }
          }
        });
      }, { threshold: 0.3 });
      timelineSteps.forEach(s => stepObserver.observe(s));
    }

    // 6. SCROLL PROGRESS & NAVBAR BEHAVIOR
    const progressBar = document.getElementById('scroll-progress');
    const navbar = document.querySelector('.navbar');
    const backToTopBtn = document.getElementById('back-to-top');

    window.addEventListener('scroll', () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const pct = maxScroll > 0 ? (window.scrollY / maxScroll) * 100 : 0;
      if (progressBar) progressBar.style.width = `${pct}%`;

      if (navbar) {
        navbar.classList.toggle('scrolled', window.scrollY > 40);
      }
      if (backToTopBtn) {
        backToTopBtn.classList.toggle('visible', window.scrollY > 500);
      }
    });

    if (backToTopBtn) {
      backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    // 7. MOBILE DRAWER
    const mobileToggle = document.getElementById('mobile-toggle');
    const mobileDrawer = document.getElementById('mobile-drawer');
    if (mobileToggle && mobileDrawer) {
      mobileToggle.addEventListener('click', () => {
        mobileDrawer.classList.toggle('open');
      });
      mobileDrawer.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
          mobileDrawer.classList.remove('open');
        });
      });
    }

    // 8. FADE IN UP ANIMATIONS
    const fadeEls = document.querySelectorAll('.fade-in-up');
    if ('IntersectionObserver' in window) {
      const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('appear');
          }
        });
      }, { threshold: 0.1 });
      fadeEls.forEach(el => fadeObserver.observe(el));
    } else {
      fadeEls.forEach(el => el.classList.add('appear'));
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }
})();

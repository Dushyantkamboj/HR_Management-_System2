import { useState, useEffect } from 'react';
import Header from '../components/Header';

import {
  Users,
  UserCheck,
  UserX,
  MapPin,
} from 'lucide-react';

import { list_employee } from '../api/user/listUser';
import ReactApexChart from 'react-apexcharts';

const Dashboard = () => {
  const [tablearr, settablearr] = useState([]);

  // =========================
  // GET EMPLOYEES
  // =========================
  useEffect(() => {
    const handleResult = async () => {
      try {
        const result = await list_employee(1, 10);

        settablearr(result.data.employees || []);
        
      } catch (error) {
        console.log("error:", error);
      }
    };

    handleResult();
  }, []);

  // =========================
  // ACTIVE EMPLOYEES
  // =========================
  const activeEmployee = tablearr.filter((employee) => {
    return employee.status === 1;
  });

  // =========================
  // INACTIVE EMPLOYEES
  // =========================
  const inactiveEmployee = tablearr.filter((employee) => {
    return employee.status !== 1;
  });

  // =========================
  // ON LEAVE (placeholder until real field exists on employee)
  // =========================
  const onLeaveCount = 7;

  // =====================================================
  // LEAVE TRENDS CHART
  // =====================================================

  const leaveChartOptions = {
    chart: {
      type: 'area',
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
    },

    colors: [
      '#4F8EF7',
      '#F34B7D',
      '#635BFF',
    ],

    stroke: {
      curve: 'smooth',
      width: 3,
    },

    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.25,
        opacityTo: 0.02,
        stops: [0, 100],
      },
    },

    markers: {
      size: 0,
      hover: {
        size: 5,
      },
    },

    dataLabels: {
      enabled: false,
    },

    grid: {
      borderColor: '#E9EDF5',
      strokeDashArray: 4,
      xaxis: {
        lines: {
          show: false,
        },
      },
    },

    xaxis: {
      categories: [
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
      ],

      axisBorder: {
        show: false,
      },

      axisTicks: {
        show: false,
      },

      labels: {
        style: {
          colors: '#8B95A7',
          fontSize: '13px',
        },
      },
    },

    yaxis: {
      min: 0,
      max: 24,
      tickAmount: 4,

      labels: {
        style: {
          colors: '#8B95A7',
          fontSize: '13px',
        },

        formatter: (value) => {
          return Math.round(value);
        },
      },
    },

    tooltip: {
      shared: true,
      intersect: false,

      y: {
        formatter: (value) => {
          return `${value} Leaves`;
        },
      },
    },

    legend: {
      show: true,
      position: 'top',
      horizontalAlign: 'right',

      fontSize: '14px',

      labels: {
        colors: '#68738A',
      },

      markers: {
        width: 10,
        height: 10,
        radius: 2,
      },

      itemMargin: {
        horizontal: 10,
      },
    },

    title: {
      text: 'Leave Trends',
      align: 'left',

      style: {
        fontSize: '18px',
        fontWeight: 600,
        color: '#111827',
      },
    },

    subtitle: {
      text: 'Monthly breakdown · Apr – Sep 2026',
      align: 'left',

      style: {
        fontSize: '14px',
        color: '#8B95A7',
        fontWeight: 400,
      },
    },
  };

  // =====================================================
  // LEAVE CHART DATA
  // =====================================================

  const leaveChartSeries = [
    {
      name: 'Annual',

      data: [
        12,
        10,
        18,
        22,
        15,
        11,
      ],
    },

    {
      name: 'Sick',

      data: [
        5,
        8,
        4,
        6,
        9,
        7,
      ],
    },

    {
      name: 'Maternity',

      data: [
        2,
        1,
        3,
        2,
        4,
        2,
      ],
    },
  ];

  // =====================================================
  // WORKFORCE STATUS DONUT CHART
  // =====================================================

  const workforceChartOptions = {
    chart: {
      type: 'donut',
    },

    labels: ['Active', 'Inactive', 'On Leave'],

    colors: [
      '#4F8EF7',
      '#F34B7D',
      '#F59E0B',
    ],

    stroke: {
      width: 2,
      colors: ['#fff'],
    },

    legend: {
      show: false,
    },

    dataLabels: {
      enabled: false,
    },

    plotOptions: {
      pie: {
        donut: {
          size: '72%',
          labels: {
            show: true,

            total: {
              show: true,
              label: 'Total',
              fontSize: '13px',
              color: '#8B95A7',
              formatter: () => tablearr.length,
            },

            value: {
              fontSize: '22px',
              fontWeight: 600,
              color: '#111827',
            },
          },
        },
      },
    },

    tooltip: {
      y: {
        formatter: (value) => {
          return `${value} Employees`;
        },
      },
    },
  };

  const workforceChartSeries = [
    activeEmployee.length,
    inactiveEmployee.length,
    onLeaveCount,
  ];

  // =====================================================
  // WORKFORCE STATUS CUSTOM LEGEND
  // =====================================================

  const workforceLegend = [
    {
      label: 'Active',
      color: '#4F8EF7',
      value: activeEmployee.length,
    },
    {
      label: 'Inactive',
      color: '#F34B7D',
      value: inactiveEmployee.length,
    },
    {
      label: 'On Leave',
      color: '#F59E0B',
      value: onLeaveCount,
    },
  ];

  const workforceMax = Math.max(
    ...workforceLegend.map((item) => item.value),
    1
  );

  // =====================================================
  // DASHBOARD STAT CARDS
  // =====================================================

  const statCards = [
    {
      id: 1,
      label: 'Total Employees',
      subtext: '3 new hires this week',
      number: tablearr.length,
      badge: '↑ 2.4%',
      badgeColor: '#16A34A',
      badgeBg: '#EAF7EF',
      iconBg: '#EEF1FE',
      iconColor: '#6C7CF7',
      accentColor: '#6C7CF7',
      blobColor: '#E4E8FD',
      icon: Users,
    },
    {
      id: 2,
      label: 'Active Employees',
      subtext: '87.1% of total workforce',
      number: activeEmployee.length,
      badge: '↑ 1.2%',
      badgeColor: '#16A34A',
      badgeBg: '#EAF7EF',
      iconBg: '#E7F8EF',
      iconColor: '#22C55E',
      accentColor: '#22C55E',
      blobColor: '#DFF6E8',
      icon: UserCheck,
    },
    {
      id: 3,
      label: 'Inactive Employees',
      subtext: '5.6% of total · 3 resigned',
      number: inactiveEmployee.length,
      badge: '↓ 2 fewer',
      badgeColor: '#DC2626',
      badgeBg: '#FCEAEC',
      iconBg: '#FDECEF',
      iconColor: '#F34B7D',
      accentColor: '#F34B7D',
      blobColor: '#FBE1E8',
      icon: UserX,
    },
    {
      id: 4,
      label: 'On Leave',
      subtext: '7 annual · 2 sick leave',
      number: onLeaveCount,
      badge: '— Same',
      badgeColor: '#8B95A7',
      badgeBg: '#F1F2F6',
      iconBg: '#FEF3E7',
      iconColor: '#F59E0B',
      accentColor: '#F59E0B',
      blobColor: '#FDEBD3',
      icon: MapPin,
    },
  ];

  return (
    <div className="ml-4 mt-8 max-w-7xl">

      <div className='mb-5'>
        <Header />
      </div>

      {/* =========================
          DASHBOARD CARDS
      ========================= */}

      <div className="grid grid-cols-4 gap-4">

        {statCards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.id}
              className="
                relative
                overflow-hidden
                bg-white
                border border-[#EDEFF5]
                rounded-2xl
                p-5
                flex
                flex-col
                gap-4
              "
            >

              {/* Decorative blob */}

              <div
                className="absolute -top-6 -right-6 w-28 h-28 rounded-full opacity-70"
                style={{ backgroundColor: card.blobColor }}
              />

              {/* Header: icon + badge */}

              <div className="relative flex items-start justify-between">

                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: card.iconBg }}
                >
                  <Icon
                    style={{
                      width: 20,
                      height: 20,
                      color: card.iconColor,
                    }}
                  />
                </div>

                <span
                  className="text-xs font-semibold px-2.5 py-1 rounded-full"
                  style={{
                    color: card.badgeColor,
                    backgroundColor: card.badgeBg,
                  }}
                >
                  {card.badge}
                </span>

              </div>

              {/* Number */}

              <p className="relative text-3xl font-bold text-[#111827]">
                {card.number}
              </p>

              {/* Label + subtext */}

              <div className="relative flex flex-col gap-0.5">
                <span className="text-sm font-semibold text-[#111827]">
                  {card.label}
                </span>

                <span className="text-xs text-[#9AA1B4]">
                  {card.subtext}
                </span>
              </div>

              {/* Bottom accent bar */}

              <div
                className="absolute bottom-0 left-0 right-0 h-1"
                style={{ backgroundColor: card.accentColor }}
              />

            </div>
          );
        })}

      </div>


      {/* =========================
          CHARTS ROW (HORIZONTAL)
      ========================= */}

      <div className="flex flex-row gap-4 mt-6 items-stretch">

        {/* LEAVE TRENDS CHART */}

        <div
          className="
            flex-1
            bg-white
            border border-[#E2E4ED]
            rounded-2xl
            p-5
          "
        >
          <ReactApexChart
            options={leaveChartOptions}
            series={leaveChartSeries}
            type="area"
            height={400}
          />
        </div>

        {/* WORKFORCE STATUS DONUT CHART */}

        <div
          className="
            w-96
            bg-white
            border border-[#E2E4ED]
            rounded-2xl
            p-5
          "
        >
          <h3 className="text-lg font-semibold text-[#111827]">
            Workforce Status
          </h3>

          <p className="text-sm text-[#8B95A7] mb-2">
            Current employee breakdown
          </p>

          <ReactApexChart
            options={workforceChartOptions}
            series={workforceChartSeries}
            type="donut"
            height={260}
          />

          {/* Custom legend with progress bars */}

          <div className="flex flex-col gap-3 mt-4">
            {workforceLegend.map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm text-[#68738A]">
                    {item.label}
                  </span>
                </div>

                <div className="flex items-center gap-2 w-32">
                  <div className="flex-1 h-1.5 bg-[#EEF0F5] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${(item.value / workforceMax) * 100}%`,
                        backgroundColor: item.color,
                      }}
                    />
                  </div>

                  <span className="text-sm font-semibold text-[#111827] w-6 text-right">
                    {item.value}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};

export default Dashboard;
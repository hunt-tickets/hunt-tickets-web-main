"use client";

import ReactECharts from 'echarts-for-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SalesDistributionChartProps {
  app: number;
  web: number;
  cash: number;
}

export function SalesDistributionChart({ app, web, cash }: SalesDistributionChartProps) {
  const data = [
    { name: 'App', value: app, itemStyle: { color: '#8b5cf6' } },
    { name: 'Web', value: web, itemStyle: { color: '#06b6d4' } },
    { name: 'Efectivo', value: cash, itemStyle: { color: '#10b981' } },
  ].filter(item => item.value > 0);

  const total = app + web + cash;

  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
      backgroundColor: '#18181b',
      borderColor: '#303030',
      borderWidth: 1,
      textStyle: {
        color: '#fff'
      },
      formatter: '{b}: {c} ({d}%)'
    },
    series: [
      {
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['50%', '50%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#0a0a0a',
          borderWidth: 2
        },
        label: {
          show: true,
          formatter: '{b} {d}%',
          color: '#888',
          fontSize: 12
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 14,
            fontWeight: 'bold',
            color: '#fff'
          },
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        },
        data: data
      }
    ]
  };

  return (
    <Card className="bg-background/50 backdrop-blur-sm border-[#303030]">
      <CardHeader>
        <CardTitle className="text-base">Distribución por Canal</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ReactECharts option={option} style={{ height: '100%', width: '100%' }} />
        </div>
        <div className="grid grid-cols-3 gap-4 mt-4">
          {data.map((item) => (
            <div key={item.name} className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.itemStyle.color }} />
                <span className="text-sm text-gray-400">{item.name}</span>
              </div>
              <p className="text-lg font-bold">{item.value}</p>
              <p className="text-xs text-gray-500">{((item.value / total) * 100).toFixed(1)}%</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

interface RevenueByChannelChartProps {
  appTotal: number;
  webTotal: number;
  cashTotal: number;
}

export function RevenueByChannelChart({ appTotal, webTotal, cashTotal }: RevenueByChannelChartProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      backgroundColor: '#18181b',
      borderColor: '#303030',
      borderWidth: 1,
      textStyle: {
        color: '#fff'
      },
      axisPointer: {
        type: 'shadow'
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      formatter: (params: any) => {
        return `${params[0].name}: ${formatCurrency(params[0].value)}`;
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: ['App', 'Web', 'Efectivo'],
      axisLine: {
        lineStyle: {
          color: '#303030'
        }
      },
      axisLabel: {
        color: '#888'
      }
    },
    yAxis: {
      type: 'value',
      axisLine: {
        lineStyle: {
          color: '#303030'
        }
      },
      axisLabel: {
        color: '#888',
        formatter: (value: number) => `$${(value / 1000).toFixed(0)}K`
      },
      splitLine: {
        lineStyle: {
          color: '#303030',
          type: 'dashed'
        }
      }
    },
    series: [
      {
        type: 'bar',
        data: [appTotal, webTotal, cashTotal],
        itemStyle: {
          color: '#8b5cf6',
          borderRadius: [8, 8, 0, 0]
        },
        emphasis: {
          itemStyle: {
            color: '#a78bfa'
          }
        }
      }
    ]
  };

  return (
    <Card className="bg-background/50 backdrop-blur-sm border-[#303030]">
      <CardHeader>
        <CardTitle className="text-base">Ingresos por Canal</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ReactECharts option={option} style={{ height: '100%', width: '100%' }} />
        </div>
      </CardContent>
    </Card>
  );
}

interface FinancialBreakdownChartProps {
  grossProfit: number;
  boldDeductions: number;
  tax4x1000: number;
  netProfit: number;
}

export function FinancialBreakdownChart({ grossProfit, boldDeductions, tax4x1000, netProfit }: FinancialBreakdownChartProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      backgroundColor: '#18181b',
      borderColor: '#303030',
      borderWidth: 1,
      textStyle: {
        color: '#fff'
      },
      axisPointer: {
        type: 'shadow'
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      formatter: (params: any) => {
        let result = 'Ganancia<br/>';
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        params.forEach((param: any) => {
          result += `${param.marker} ${param.seriesName}: ${formatCurrency(param.value)}<br/>`;
        });
        return result;
      }
    },
    legend: {
      data: ['Ganancia Bruta', 'Deducciones Bold', 'Impuesto 4x1000', 'Ganancia Neta'],
      textStyle: {
        color: '#888'
      },
      top: 0
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '15%',
      containLabel: true
    },
    xAxis: {
      type: 'value',
      axisLine: {
        lineStyle: {
          color: '#303030'
        }
      },
      axisLabel: {
        color: '#888',
        formatter: (value: number) => `$${(value / 1000).toFixed(0)}K`
      },
      splitLine: {
        lineStyle: {
          color: '#303030',
          type: 'dashed'
        }
      }
    },
    yAxis: {
      type: 'category',
      data: ['Ganancia'],
      axisLine: {
        lineStyle: {
          color: '#303030'
        }
      },
      axisLabel: {
        color: '#888'
      }
    },
    series: [
      {
        name: 'Ganancia Bruta',
        type: 'bar',
        stack: 'total',
        data: [grossProfit],
        itemStyle: {
          color: '#10b981',
          borderRadius: [0, 8, 8, 0]
        }
      },
      {
        name: 'Deducciones Bold',
        type: 'bar',
        stack: 'deductions',
        data: [boldDeductions],
        itemStyle: {
          color: '#ef4444',
          borderRadius: [0, 8, 8, 0]
        }
      },
      {
        name: 'Impuesto 4x1000',
        type: 'bar',
        stack: 'deductions',
        data: [tax4x1000],
        itemStyle: {
          color: '#f59e0b',
          borderRadius: [0, 8, 8, 0]
        }
      },
      {
        name: 'Ganancia Neta',
        type: 'bar',
        stack: 'net',
        data: [netProfit],
        itemStyle: {
          color: '#8b5cf6',
          borderRadius: [0, 8, 8, 0]
        }
      }
    ]
  };

  return (
    <Card className="bg-background/50 backdrop-blur-sm border-[#303030]">
      <CardHeader>
        <CardTitle className="text-base">Desglose Financiero Hunt</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ReactECharts option={option} style={{ height: '100%', width: '100%' }} />
        </div>
      </CardContent>
    </Card>
  );
}

interface TicketRevenueDistributionChartProps {
  tickets: Array<{
    name: string;
    revenue: number;
    quantity: number;
    percentage: number;
    color?: string;
  }>;
}

interface ChannelSalesChartProps {
  app: number;
  web: number;
  cash: number;
}

export function TicketRevenueDistributionChart({ tickets }: TicketRevenueDistributionChartProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatCurrencyShort = (value: number) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
    return `$${value}`;
  };

  const maxRevenue = Math.max(...tickets.map(t => t.revenue));
  const minRevenue = Math.min(...tickets.map(t => t.revenue));
  const totalRevenue = tickets.reduce((sum, t) => sum + t.revenue, 0);

  // Estructura de datos para treemap (empaquetado rectangular)
  const data = {
    name: 'root',
    children: tickets.map((ticket) => {
      const normalized = ((ticket.revenue - minRevenue) / (maxRevenue - minRevenue)) || 0;
      const lightness = 25 + normalized * 40; // 25-65% escala de grises

      return {
        name: ticket.name,
        value: ticket.revenue,
        itemStyle: {
          color: `hsl(0, 0%, ${lightness}%)`,
          borderColor: '#18181b',
          borderWidth: 2
        }
      };
    })
  };

  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
      backgroundColor: '#18181b',
      borderColor: '#303030',
      borderWidth: 1,
      textStyle: {
        color: '#fff'
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      formatter: (params: any) => {
        const ticket = tickets.find(t => t.name === params.name);
        if (!ticket) return '';
        return `<strong>${params.name}</strong><br/>
                Ingresos: ${formatCurrency(ticket.revenue)}<br/>
                Vendidos: ${ticket.quantity}<br/>
                Participación: ${ticket.percentage.toFixed(1)}%`;
      }
    },
    series: [
      {
        type: 'treemap',
        data: data.children,
        roam: false,
        nodeClick: false,
        width: '100%',
        height: '100%',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        breadcrumb: {
          show: false
        },
        levels: [
          {
            itemStyle: {
              borderWidth: 0
            }
          },
          {
            itemStyle: {
              borderWidth: 2,
              borderColor: '#0a0a0a',
              gapWidth: 2
            }
          }
        ],
        label: {
          show: true,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          formatter: (params: any) => {
            const ticket = tickets.find(t => t.name === params.name);
            if (!ticket) return '';
            const percentage = ((params.value / totalRevenue) * 100).toFixed(1);
            // Solo mostrar etiqueta si el área es suficientemente grande
            if (params.value / totalRevenue < 0.03) return '';
            return `{name|${params.name}}\n{value|${formatCurrencyShort(params.value)}}\n{percent|${percentage}%}`;
          },
          rich: {
            name: {
              color: '#fff',
              fontSize: 11,
              fontWeight: 'bold',
              lineHeight: 16
            },
            value: {
              color: '#fff',
              fontSize: 10,
              lineHeight: 14
            },
            percent: {
              color: '#fff',
              fontSize: 9,
              opacity: 0.8,
              lineHeight: 12
            }
          },
          position: 'inside'
        },
        emphasis: {
          itemStyle: {
            borderColor: '#fff',
            borderWidth: 3,
            shadowBlur: 10,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          },
          label: {
            fontSize: 12
          }
        }
      }
    ]
  };

  return (
    <div className="h-full">
      <ReactECharts
        option={option}
        style={{ height: '100%', width: '100%' }}
        opts={{ renderer: 'canvas' }}
      />
    </div>
  );
}

export function ChannelSalesChart({ app, web, cash }: ChannelSalesChartProps) {
  const total = app + web + cash;

  const data = [
    {
      name: 'App Móvil',
      value: app,
      itemStyle: { color: '#8b5cf6' }
    },
    {
      name: 'Web',
      value: web,
      itemStyle: { color: '#06b6d4' }
    },
    {
      name: 'Efectivo',
      value: cash,
      itemStyle: { color: '#10b981' }
    }
  ].filter(item => item.value > 0);

  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
      backgroundColor: '#18181b',
      borderColor: '#303030',
      borderWidth: 1,
      textStyle: {
        color: '#fff'
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      formatter: (params: any) => {
        const percentage = ((params.value / total) * 100).toFixed(1);
        return `<strong>${params.name}</strong><br/>
                ${params.value} tickets<br/>
                ${percentage}%`;
      }
    },
    series: [
      {
        type: 'pie',
        radius: ['45%', '75%'],
        center: ['50%', '50%'],
        avoidLabelOverlap: false,
        padAngle: 2,
        itemStyle: {
          borderRadius: 6,
          borderColor: '#0a0a0a',
          borderWidth: 2
        },
        label: {
          show: true,
          position: 'outside',
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          formatter: (params: any) => {
            const percentage = ((params.value / total) * 100).toFixed(0);
            return `{name|${params.name}}\n{value|${params.value}} {percent|(${percentage}%)}`;
          },
          rich: {
            name: {
              color: '#fff',
              fontSize: 11,
              fontWeight: 'bold',
              lineHeight: 16
            },
            value: {
              color: '#fff',
              fontSize: 10,
              lineHeight: 14
            },
            percent: {
              color: '#888',
              fontSize: 9,
              lineHeight: 12
            }
          }
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 15,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
            borderColor: '#fff',
            borderWidth: 3
          },
          label: {
            fontSize: 12
          }
        },
        labelLine: {
          show: true,
          length: 10,
          length2: 10,
          lineStyle: {
            color: '#303030'
          }
        },
        data: data
      }
    ]
  };

  return (
    <div className="h-full">
      <ReactECharts
        option={option}
        style={{ height: '100%', width: '100%' }}
        opts={{ renderer: 'canvas' }}
      />
    </div>
  );
}

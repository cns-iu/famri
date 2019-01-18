import { DataSource, DefaultGraphicSymbol, DefaultGraphicVariableMapping, DefaultProject,
  DefaultRecordSet, GeomapVisualization, GraphicSymbol, GraphicVariable, Project, RecordSet,
  ScatterplotVisualization, Visualization, DefaultDataSource, DefaultRawData, RawData, NetworkVisualization } from '@dvl-fw/core';
import { FamriDatabase } from '../data-model/famri-database';


export class FamriProject extends DefaultProject {

  constructor(private database: FamriDatabase) {
    super();

    this.rawData = this.getRawData(database);
    this.dataSources = this.getDataSources();
    this.recordSets = this.getRecordSets();
    this.graphicVariables = this.getGraphicVariables();
    this.graphicSymbols = this.getGraphicSymbols();
    this.visualizations = this.getVisualizations();
  }

  getRawData(database: FamriDatabase): RawData[] {
    return [
      new DefaultRawData({id: 'famriRawData', template: 'json', data: database}),
      // TODO: fix associated bug in MAV
      new DefaultRawData({id: 'activityLog', template: 'activityLog', data: { 'activityLog': [] }})
    ];
  }

  getDataSources(): DataSource[] {
    return [
      new DefaultDataSource({
        id: 'famriDataSource', template: 'defaultDataSource', // TODO: fix associated bug in MAV
        properties: { rawData: 'famriRawData' },
        recordStreams: [
          {id: 'publications', label: 'Publications'},
          {id: 'authors', label: 'Authors'},
          {id: 'coAuthorLinks', label: 'Co-Author Links'}
        ]
      }, this)
    ];
  }

  getRecordSets(): RecordSet[] {
    const recordSets = [
      new DefaultRecordSet({
        id: 'publication',
        label: 'FAMRI Publication',
        labelPlural: 'FAMRI Publications',
        description: `${this.database.publications[0].globalStats.yearMin} - ${this.database.publications[0].globalStats.yearMax}`,
        defaultRecordStream: 'publications',
        dataVariables: [
          {id: 'title', label: 'Title', dataType: 'text', scaleType: 'nominal'},
          {id: 'authors', label: 'Authors', dataType: 'text', scaleType: 'nominal'},
          {id: 'topicArea', label: 'Topic Area', dataType: 'text', scaleType: 'nominal'},
          {id: 'journalName', label: 'Journal', dataType: 'text', scaleType: 'nominal'},
          {id: 'publicationYear', label: 'Publication Year', dataType: 'integer', scaleType: 'interval'},
          {id: 'numCites', label: '# Citations', dataType: 'integer', scaleType: 'ratio'},
          {id: 'id', label: 'Record ID', dataType: 'text', scaleType: 'nominal'}
        ]
      }, this),
      new DefaultRecordSet({
        id: 'author',
        label: 'Author',
        labelPlural: 'Authors',
        parent: 'publication',
        description: 'from FAMRI Publications',
        defaultRecordStream: 'authors',
        dataVariables: [
          {id: 'name', label: 'Name', dataType: 'text', scaleType: 'nominal'},
          {id: 'numPapers', label: '# Publications', dataType: 'integer', scaleType: 'ratio'},
          {id: 'numCites', label: '# Citations', dataType: 'integer', scaleType: 'ratio'},
          {id: 'hIndex', label: 'H-Index', dataType: 'integer', scaleType: 'ratio'},
          {id: 'firstYear', label: 'First Year', dataType: 'integer', scaleType: 'interval'},
          {id: 'lastYear', label: 'Last Year', dataType: 'integer', scaleType: 'interval'},
          {id: 'topicArea', label: 'Topic Area', dataType: 'text', scaleType: 'nominal'},
          {id: 'x', label: 'X', dataType: 'number', scaleType: 'interval'},
          {id: 'y', label: 'Y', dataType: 'number', scaleType: 'interval'}
        ]
      }, this),
      new DefaultRecordSet({
        id: 'coAuthorLink',
        label: 'Co-Author Link',
        labelPlural: 'Co-Author Links',
        parent: 'publication',
        description: 'from FAMRI Publications',
        defaultRecordStream: 'coAuthorLinks',
        dataVariables: [
          {id: 'author1', label: 'Author 1', dataType: 'text', scaleType: 'nominal'},
          {id: 'author2', label: 'Author 2', dataType: 'text', scaleType: 'nominal'},
          {id: 'numPapers', label: '# Joint Publications', dataType: 'integer', scaleType: 'ratio'},
          {id: 'numCites', label: '# Joint Citations', dataType: 'integer', scaleType: 'ratio'},
          {id: 'firstYear', label: 'First Year', dataType: 'integer', scaleType: 'interval'},
          {id: 'lastYear', label: 'Last Year', dataType: 'integer', scaleType: 'interval'},
          {id: 'identifier', label: 'Identifier', dataType: 'text', scaleType: 'nominal'},
          {id: 'sourceX', label: 'Author 1 X', dataType: 'number', scaleType: 'interval'},
          {id: 'sourceY', label: 'Author 1 Y', dataType: 'number', scaleType: 'interval'},
          {id: 'targetX', label: 'Author 2 X', dataType: 'number', scaleType: 'interval'},
          {id: 'targetY', label: 'Author 2 Y', dataType: 'number', scaleType: 'interval'}
        ]
      }, this)
    ];
    recordSets.forEach(rs => rs.resolveParent(recordSets));
    return recordSets;
  }

  getGraphicVariables(): GraphicVariable[] {
    return DefaultGraphicVariableMapping.fromJSON([
      {
        recordStream: 'publications',
        mappings: {
          publication: {
            id: {
              identifier: [
                {selector: 'id'}
              ],
              transparency: [
                {id: 'fixed', selector: 'defaultStyles.transparency', label: 'Default'}
              ],
              strokeColor: [
                {id: 'fixed', selector: 'defaultStyles.strokeColor', label: 'Default'}
              ],
              strokeWidth: [
                {id: 'fixed', selector: 'defaultStyles.strokeWidth', label: 'Default'}
              ],
              strokeTransparency: [
                {id: 'fixed', selector: 'defaultStyles.strokeTransparency', label: 'Default'}
              ]
            },
            title: {
              axis: [
                {selector: 'title'}
              ],
              text: [
                {selector: 'title'}
              ]
            },
            authors: {
              text: [
                {selector: 'authorsLabel'}
              ]
            },
            journalName: {
              axis: [
                {selector: 'journalName'}
              ],
              text: [
                {selector: 'journalName'}
              ]
            },
            topicArea: {
              axis: [
                {selector: 'topicArea'}
              ],
              text: [
                {selector: 'topicArea'}
              ]
            },
            numCites: {
              axis: [
                {selector: 'numCitesLabel'}
              ],
              text: [
                {selector: 'numCitesLabel'}
              ],
              input: [
                {selector: 'numCites'}
              ],
              label: [
                {selector: 'numCitesLabel'}
              ],
              order: [
                {selector: 'numCites'},
              ],
              areaSize: [
                {selector: 'numCitesAreaSize'}
              ],
              fontSize: [
                {selector: 'numCitesFontSize'}
              ],
              color: [
                {selector: 'numCitesColor'}
              ],
              strokeColor: [
                {selector: 'numCitesStrokeColor'}
              ],
              transparency: [
                {selector: 'numCitesTransparency'}
              ],
              strokeTransparency: [
                {selector: 'numCitesTransparency'}
              ],
            },
            publicationYear: {
              axis: [
                {selector: 'publicationYearLabel'}
              ],
              text: [
                {selector: 'publicationYearLabel'}
              ],
              input: [
                {selector: 'publicationYear'}
              ],
              label: [
                {selector: 'publicationYearLabel'}
              ],
              order: [
                {selector: 'publicationYear'},
              ],
              areaSize: [
                {selector: 'publicationYearAreaSize'}
              ],
              fontSize: [
                {selector: 'publicationYearFontSize'}
              ],
              color: [
                {selector: 'publicationYearColor'}
              ],
              strokeColor: [
                {selector: 'publicationYearStrokeColor'}
              ]
            },
          }
        }
      },
      {
        recordStream: 'authors',
        mappings: {
          author: {
            name: {
              identifier: [
                {selector: 'name'}
              ],
              axis: [
                {selector: 'name'}
              ],
              text: [
                {selector: 'name'}
              ],
              label: [
                {selector: 'label'}
              ],
              transparency: [
                {id: 'fixed', selector: 'defaultStyles.transparency', label: 'Default'}
              ],
              strokeColor: [
                {id: 'fixed', selector: 'defaultStyles.strokeColor', label: 'Default'}
              ],
              strokeWidth: [
                {id: 'fixed', selector: 'defaultStyles.strokeWidth', label: 'Default'}
              ],
              strokeTransparency: [
                {id: 'fixed', selector: 'defaultStyles.strokeTransparency', label: 'Default'}
              ]
            },
            x: {
              text: [
                {selector: 'position[0]'}
              ],
              axis: [
                {selector: 'position[0]'}
              ]
            },
            y: {
              text: [
                {selector: 'position[1]'}
              ],
              axis: [
                {selector: 'position[1]'}
              ]
            },
            numCites: {
              axis: [
                {selector: 'numCitesLabel'}
              ],
              text: [
                {selector: 'numCitesLabel'}
              ],
              input: [
                {selector: 'numCites'}
              ],
              label: [
                {selector: 'numCitesLabel'}
              ],
              order: [
                {selector: 'numCites'},
              ],
              areaSize: [
                {selector: 'numCitesAreaSize'}
              ],
              fontSize: [
                {selector: 'numCitesFontSize'}
              ],
              color: [
                {selector: 'numCitesColor'}
              ],
              strokeColor: [
                {selector: 'numCitesStrokeColor'}
              ]
            },
            hIndex: {
              axis: [
                {selector: 'hIndexLabel'}
              ],
              text: [
                {selector: 'hIndexLabel'}
              ],
              input: [
                {selector: 'hIndex'}
              ],
              label: [
                {selector: 'hIndexLabel'}
              ],
              order: [
                {selector: 'hIndex'},
              ],
              areaSize: [
                {selector: 'hIndexAreaSize'}
              ],
              fontSize: [
                {selector: 'hIndexFontSize'}
              ],
              color: [
                {selector: 'hIndexColor'}
              ],
              strokeColor: [
                {selector: 'hIndexStrokeColor'}
              ]
            },
            numPapers: {
              axis: [
                {selector: 'numPapersLabel'}
              ],
              text: [
                {selector: 'numPapersLabel'}
              ],
              input: [
                {selector: 'numPapers'}
              ],
              label: [
                {selector: 'numPapersLabel'}
              ],
              order: [
                {selector: 'numPapers'},
              ],
              areaSize: [
                {selector: 'numPapersAreaSize'}
              ],
              fontSize: [
                {selector: 'numPapersFontSize'}
              ],
              color: [
                {selector: 'numPapersColor'}
              ],
              strokeColor: [
                {selector: 'numPapersStrokeColor'}
              ],
              transparency: [
                {selector: 'numPapersTransparency'}
              ],
              strokeTransparency: [
                {selector: 'numPapersTransparency'}
              ]
            },
            firstYear: {
              axis: [
                {selector: 'firstYearLabel'}
              ],
              text: [
                {selector: 'firstYearLabel'}
              ],
              input: [
                {selector: 'firstYear'}
              ],
              label: [
                {selector: 'firstYearLabel'}
              ],
              order: [
                {selector: 'firstYear'},
              ],
              areaSize: [
                {selector: 'firstYearAreaSize'}
              ],
              fontSize: [
                {selector: 'firstYearFontSize'}
              ],
              color: [
                {selector: 'firstYearColor'}
              ],
              strokeColor: [
                {selector: 'firstYearStrokeColor'}
              ]
            },
            lastYear: {
              axis: [
                {selector: 'lastYearLabel'}
              ],
              text: [
                {selector: 'lastYearLabel'}
              ],
              input: [
                {selector: 'lastYear'}
              ],
              label: [
                {selector: 'lastYearLabel'}
              ],
              order: [
                {selector: 'lastYear'},
              ],
              areaSize: [
                {selector: 'lastYearAreaSize'}
              ],
              fontSize: [
                {selector: 'lastYearFontSize'}
              ],
              color: [
                {selector: 'lastYearColor'}
              ],
              strokeColor: [
                {selector: 'lastYearStrokeColor'}
              ]
            },
            topicArea: {
              axis: [
                {selector: 'topicArea'}
              ],
              text: [
                {selector: 'topicArea'}
              ]
            },
          }
        }
      },
      {
        recordStream: 'coAuthorLinks',
        mappings: {
          coAuthorLink: {
            author1: {
              identifier: [
                {selector: 'author1'}
              ],
              axis: [
                {selector: 'author1'}
              ],
              text: [
                {selector: 'author1'}
              ]
            },
            author2: {
              identifier: [
                {selector: 'author2'}
              ],
              axis: [
                {selector: 'author2'}
              ],
              text: [
                {selector: 'author2'}
              ]
            },
            identifier: {
              identifier: [
                {selector: 'identifier'}
              ],
              transparency: [
                {id: 'fixed', selector: 'defaultStyles.transparency', label: 'Default'}
              ],
              strokeColor: [
                {id: 'fixed', selector: 'defaultStyles.strokeColor', label: 'Default'}
              ],
              strokeWidth: [
                {id: 'fixed', selector: 'defaultStyles.strokeWidth', label: 'Default'}
              ],
              strokeTransparency: [
                {id: 'fixed', selector: 'defaultStyles.strokeTransparency', label: 'Default'}
              ]
            },
            sourceX: {
              text: [
                {selector: 'source[0]'}
              ],
              axis: [
                {selector: 'source[0]'}
              ]
            },
            sourceY: {
              text: [
                {selector: 'source[1]'}
              ],
              axis: [
                {selector: 'source[1]'}
              ]
            },
            targetX: {
              text: [
                {selector: 'target[0]'}
              ],
              axis: [
                {selector: 'target[0]'}
              ]
            },
            targetY: {
              text: [
                {selector: 'target[1]'}
              ],
              axis: [
                {selector: 'target[1]'}
              ]
            },
            numCites: {
              axis: [
                {selector: 'numCitesLabel'}
              ],
              text: [
                {selector: 'numCitesLabel'}
              ],
              input: [
                {selector: 'numCites'}
              ],
              label: [
                {selector: 'numCitesLabel'}
              ],
              order: [
                {selector: 'numCites'},
              ],
              areaSize: [
                {selector: 'numCitesAreaSize'}
              ],
              strokeWidth: [
                {selector: 'numCitesStrokeWidth'}
              ],
              fontSize: [
                {selector: 'numCitesFontSize'}
              ],
              color: [
                {selector: 'numCitesColor'}
              ],
              strokeColor: [
                {selector: 'numCitesStrokeColor'}
              ]
            },
            numPapers: {
              axis: [
                {selector: 'numPapersLabel'}
              ],
              text: [
                {selector: 'numPapersLabel'}
              ],
              input: [
                {selector: 'numPapers'}
              ],
              label: [
                {selector: 'numPapersLabel'}
              ],
              order: [
                {selector: 'numPapers'},
              ],
              areaSize: [
                {selector: 'numPapersAreaSize'}
              ],
              strokeWidth: [
                {selector: 'numPapersStrokeWidth'}
              ],
              fontSize: [
                {selector: 'numPapersFontSize'}
              ],
              color: [
                {selector: 'numPapersColor'}
              ],
              transparency: [
                {selector: 'numPapersTransparency'}
              ],
              strokeTransparency: [
                {selector: 'numPapersTransparency'}
              ],
              strokeColor: [
                {selector: 'numPapersStrokeColor'}
              ]
            },
            firstYear: {
              axis: [
                {selector: 'firstYearLabel'}
              ],
              text: [
                {selector: 'firstYearLabel'}
              ],
              input: [
                {selector: 'firstYear'}
              ],
              label: [
                {selector: 'firstYearLabel'}
              ],
              order: [
                {selector: 'firstYear'},
              ],
              areaSize: [
                {selector: 'firstYearAreaSize'}
              ],
              strokeWidth: [
                {selector: 'firstYearStrokeWidth'}
              ],
              fontSize: [
                {selector: 'firstYearFontSize'}
              ],
              color: [
                {selector: 'firstYearColor'}
              ],
              strokeColor: [
                {selector: 'firstYearStrokeColor'}
              ]
            },
            lastYear: {
              axis: [
                {selector: 'lastYearLabel'}
              ],
              text: [
                {selector: 'lastYearLabel'}
              ],
              input: [
                {selector: 'lastYear'}
              ],
              label: [
                {selector: 'lastYearLabel'}
              ],
              order: [
                {selector: 'lastYear'},
              ],
              areaSize: [
                {selector: 'lastYearAreaSize'}
              ],
              strokeWidth: [
                {selector: 'lastYearStrokeWidth'}
              ],
              fontSize: [
                {selector: 'lastYearFontSize'}
              ],
              color: [
                {selector: 'lastYearColor'}
              ],
              strokeColor: [
                {selector: 'lastYearStrokeColor'}
              ]
            }
          }
        }
      }
    ], this);
  }

  getGraphicSymbols(): GraphicSymbol[] {
    return [
      new DefaultGraphicSymbol({
        id: 'authorPoints',
        type: 'area',
        recordStream: 'authors',
        graphicVariables: {
          identifier: {
            recordSet: 'author',
            dataVariable: 'name',
            graphicVariableType: 'identifier',
            graphicVariableId: 'identifier'
          },
          x: {
            recordSet: 'author',
            dataVariable: 'x',
            graphicVariableType: 'axis',
            graphicVariableId: 'axis'
          },
          y: {
            recordSet: 'author',
            dataVariable: 'y',
            graphicVariableType: 'axis',
            graphicVariableId: 'axis'
          },
          areaSize: {
            recordSet: 'author',
            dataVariable: 'numPapers',
            graphicVariableType: 'areaSize',
            graphicVariableId: 'areaSize'
          },
          color: {
            recordSet: 'author',
            dataVariable: 'hIndex',
            graphicVariableType: 'color',
            graphicVariableId: 'color'
          },
          label: {
            recordSet: 'author',
            dataVariable: 'name',
            graphicVariableType: 'label',
            graphicVariableId: 'label'
          },
          tooltip: {
            recordSet: 'author',
            dataVariable: 'name',
            graphicVariableType: 'text',
            graphicVariableId: 'text'
          },
          transparency: {
            recordSet: 'author',
            dataVariable: 'name',
            graphicVariableType: 'transparency',
            graphicVariableId: 'fixed'
          },
          strokeTransparency: {
            recordSet: 'author',
            dataVariable: 'name',
            graphicVariableType: 'strokeTransparency',
            graphicVariableId: 'fixed'
          },
          strokeWidth: {
            recordSet: 'author',
            dataVariable: 'name',
            graphicVariableType: 'strokeWidth',
            graphicVariableId: 'fixed'
          },
          strokeColor: {
            recordSet: 'author',
            dataVariable: 'name',
            graphicVariableType: 'strokeColor',
            graphicVariableId: 'fixed'
          }
        }
      }, this),
      new DefaultGraphicSymbol({
        id: 'coAuthorLinks',
        type: 'line',
        recordStream: 'coAuthorLinks',
        graphicVariables: {
          identifier: {
            recordSet: 'coAuthorLink',
            dataVariable: 'identifier',
            graphicVariableType: 'identifier',
            graphicVariableId: 'identifier'
          },
          sourceX: {
            recordSet: 'coAuthorLink',
            dataVariable: 'sourceX',
            graphicVariableType: 'axis',
            graphicVariableId: 'axis'
          },
          sourceY: {
            recordSet: 'coAuthorLink',
            dataVariable: 'sourceY',
            graphicVariableType: 'axis',
            graphicVariableId: 'axis'
          },
          targetX: {
            recordSet: 'coAuthorLink',
            dataVariable: 'targetX',
            graphicVariableType: 'axis',
            graphicVariableId: 'axis'
          },
          targetY: {
            recordSet: 'coAuthorLink',
            dataVariable: 'targetY',
            graphicVariableType: 'axis',
            graphicVariableId: 'axis'
          },
          strokeWidth: {
            recordSet: 'coAuthorLink',
            dataVariable: 'numPapers',
            graphicVariableType: 'strokeWidth',
            graphicVariableId: 'strokeWidth'
          },
          strokeColor: {
            recordSet: 'coAuthorLink',
            dataVariable: 'firstYear',
            graphicVariableType: 'color',
            graphicVariableId: 'color'
          },
          tooltip: {
            recordSet: 'coAuthorLink',
            dataVariable: 'identifier',
            graphicVariableType: 'identifier',
            graphicVariableId: 'identifier'
          },
          transparency: {
            recordSet: 'coAuthorLink',
            dataVariable: 'identifier',
            graphicVariableType: 'transparency',
            graphicVariableId: 'fixed'
          },
          strokeTransparency: {
            recordSet: 'coAuthorLink',
            dataVariable: 'identifier',
            graphicVariableType: 'strokeTransparency',
            graphicVariableId: 'fixed'
          }
        }
      }, this)
    ];
  }

  getVisualizations(): Visualization[] {
    return [
      new NetworkVisualization({
        id: 'NW01',
        template: 'network',
        properties: {},
        graphicSymbols: {
          edges: 'coAuthorLinks',
          nodes: 'authorPoints'
        }
      }, this)
    ];
  }
}

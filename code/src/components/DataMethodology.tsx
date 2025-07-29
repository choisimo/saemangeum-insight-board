import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { ChevronDown, Database, Calculator, ExternalLink, Info } from "lucide-react";
import { useState } from "react";

interface DataSource {
  name: string;
  description: string;
  endpoint: string;
  updateFrequency: string;
  lastUpdated: string;
  recordCount: number;
  dataQuality: number;
}

interface CalculationFormula {
  name: string;
  formula: string;
  description: string;
  variables: { name: string; description: string; unit?: string }[];
  example?: string;
}

interface DataMethodologyProps {
  title: string;
  dataSources: DataSource[];
  calculations: CalculationFormula[];
  limitations?: string[];
  notes?: string[];
}

export function DataMethodology({ 
  title, 
  dataSources, 
  calculations, 
  limitations = [], 
  notes = [] 
}: DataMethodologyProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Card className="mt-8 border-muted">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Info className="h-5 w-5" />
                {title} - 데이터 출처 및 계산 방법
              </CardTitle>
              <Button variant="ghost" size="sm">
                <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
              </Button>
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <CardContent className="space-y-6">
            {/* 데이터 출처 */}
            <div>
              <h3 className="font-semibold text-base mb-3 flex items-center gap-2">
                <Database className="h-4 w-4" />
                데이터 출처
              </h3>
              <div className="space-y-3">
                {dataSources.map((source, index) => (
                  <div key={index} className="border rounded-lg p-4 bg-muted/20">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-medium">{source.name}</h4>
                        <p className="text-sm text-muted-foreground">{source.description}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          품질: {source.dataQuality}%
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {source.recordCount.toLocaleString()}건
                        </Badge>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs text-muted-foreground">
                      <div>
                        <span className="font-medium">API 엔드포인트:</span>
                        <br />
                        <code className="bg-muted px-1 rounded text-xs break-all">
                          {source.endpoint}
                        </code>
                      </div>
                      <div>
                        <span className="font-medium">업데이트 주기:</span>
                        <br />
                        {source.updateFrequency}
                      </div>
                      <div>
                        <span className="font-medium">최종 업데이트:</span>
                        <br />
                        {source.lastUpdated}
                      </div>
                    </div>
                    <div className="mt-2">
                      <Button variant="outline" size="sm" asChild>
                        <a 
                          href={`https://www.data.go.kr/data/15121622/openapi.do`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-xs"
                        >
                          <ExternalLink className="h-3 w-3 mr-1" />
                          공공데이터포털에서 확인
                        </a>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 계산 공식 */}
            <div>
              <h3 className="font-semibold text-base mb-3 flex items-center gap-2">
                <Calculator className="h-4 w-4" />
                계산 공식 및 방법론
              </h3>
              <div className="space-y-4">
                {calculations.map((calc, index) => (
                  <div key={index} className="border rounded-lg p-4 bg-muted/20">
                    <h4 className="font-medium mb-2">{calc.name}</h4>
                    <p className="text-sm text-muted-foreground mb-3">{calc.description}</p>
                    
                    <div className="bg-background border rounded p-3 mb-3">
                      <div className="font-mono text-sm">
                        <strong>공식:</strong> <code className="bg-muted px-2 py-1 rounded">{calc.formula}</code>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="text-sm font-medium">변수 설명:</div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {calc.variables.map((variable, vIndex) => (
                          <div key={vIndex} className="text-xs">
                            <code className="bg-muted px-1 rounded font-mono">{variable.name}</code>
                            <span className="ml-2">{variable.description}</span>
                            {variable.unit && (
                              <span className="text-muted-foreground ml-1">({variable.unit})</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {calc.example && (
                      <div className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded text-xs">
                        <strong>예시:</strong> {calc.example}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* 제한사항 */}
            {limitations.length > 0 && (
              <div>
                <h3 className="font-semibold text-base mb-3 text-amber-600">⚠️ 데이터 제한사항</h3>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  {limitations.map((limitation, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-amber-500 mt-1">•</span>
                      {limitation}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* 참고사항 */}
            {notes.length > 0 && (
              <div>
                <h3 className="font-semibold text-base mb-3 text-blue-600">📝 참고사항</h3>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  {notes.map((note, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-blue-500 mt-1">•</span>
                      {note}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* 데이터 신뢰성 정보 */}
            <div className="border-t pt-4">
              <div className="text-xs text-muted-foreground space-y-1">
                <div>• 모든 데이터는 공공데이터포털(data.go.kr)의 새만금개발청 공식 API를 통해 실시간으로 수집됩니다.</div>
                <div>• 계산 결과는 수집된 원시 데이터를 기반으로 하며, 데이터 품질에 따라 정확도가 달라질 수 있습니다.</div>
                <div>• 데이터 업데이트 지연이나 API 오류 시 이전 데이터가 표시될 수 있습니다.</div>
                <div>• 문의사항: 새만금개발청 데이터 담당부서 (data@saemangeum.go.kr)</div>
              </div>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}

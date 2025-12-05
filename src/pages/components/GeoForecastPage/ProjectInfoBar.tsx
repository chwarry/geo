import React from 'react';
import { Spin } from '@arco-design/web-react';
import { IconFile } from '@arco-design/web-react/icon';
import { Project } from '../../../services/geoForecastAPI';

interface ProjectInfoBarProps {
  loading: boolean;
  projectInfo: Project | null;
}

const ProjectInfoBar: React.FC<ProjectInfoBarProps> = ({ loading, projectInfo }) => {
  return (
    <div style={{ 
      marginBottom: '10px',
      padding: '4px 12px',
      backgroundColor: '#fff',
      borderRadius: '2px',
      border: '1px solid #e8e9ea',
      borderLeft: '2px solid #165dff'
    }}>
      <Spin loading={loading}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px', fontSize: '12px', lineHeight: '1.2' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <IconFile style={{ marginRight: '4px', color: '#165dff', fontSize: '12px' }} />
            <span style={{ fontWeight: 500, color: '#1d2129', marginRight: '4px' }}>建设单位:</span>
            <span style={{ color: '#4e5969' }}>
              {projectInfo?.constructionUnit || '中国铁路昆明局集团有限公司'}
            </span>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <IconFile style={{ marginRight: '4px', color: '#165dff', fontSize: '12px' }} />
            <span style={{ fontWeight: 500, color: '#1d2129', marginRight: '4px' }}>项目名称:</span>
            <span style={{ color: '#4e5969' }}>
              {projectInfo?.name || '渝昆高铁引入昆明枢纽组织工程'}
            </span>
          </div>
        </div>
      </Spin>
    </div>
  );
};

export default ProjectInfoBar;


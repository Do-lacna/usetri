// components/UploadProgressIndicator.tsx
import type React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS } from '~/src/lib/constants';
import type { UploadProgress } from './use-background-upload';

interface UploadProgressIndicatorProps {
  progress: UploadProgress;
  isVisible: boolean;
  onRetryFailed?: () => void;
  onClearCompleted?: () => void;
  onToggleDetails?: () => void;
}

export const UploadProgressIndicator: React.FC<
  UploadProgressIndicatorProps
> = ({
  progress,
  isVisible,
  onRetryFailed,
  onClearCompleted,
  onToggleDetails,
}) => {
  if (!isVisible || progress.total === 0) {
    return null;
  }

  const completionPercentage =
    progress.total > 0
      ? Math.round((progress.completed / progress.total) * 100)
      : 0;

  const getStatusText = () => {
    if (progress.uploading > 0) {
      return `Nahráva sa ${progress.uploading} obrázkov...`;
    }
    if (progress.pending > 0) {
      return `${progress.pending} obrázkov čaká na nahranie`;
    }
    if (progress.failed > 0) {
      return `${progress.failed} obrázkov zlyhalo`;
    }
    if (progress.completed === progress.total) {
      return 'Všetky obrázky boli nahrané!';
    }
    return '';
  };

  const getStatusColor = () => {
    if (progress.failed > 0) return COLORS.error;       // #EE525B
    if (progress.uploading > 0) return COLORS.success;  // #4CB963
    if (progress.completed === progress.total) return COLORS.success;
    return COLORS.n6;                                    // #B39FCA muted
  };

  return (
    <View style={[styles.container, { borderLeftColor: getStatusColor() }]}>
      <TouchableOpacity onPress={onToggleDetails} style={styles.mainContent}>
        <View style={styles.headerRow}>
          <Text style={styles.statusText}>{getStatusText()}</Text>
          <Text style={styles.progressText}>
            {progress.completed}/{progress.total}
          </Text>
        </View>

        <View style={styles.progressBarContainer}>
          <View
            style={[
              styles.progressBar,
              {
                width: `${completionPercentage}%`,
                backgroundColor: getStatusColor(),
              },
            ]}
          />
        </View>
      </TouchableOpacity>

      <View style={styles.actionButtons}>
        {progress.failed > 0 && (
          <TouchableOpacity onPress={onRetryFailed} style={styles.retryButton}>
            <Text style={styles.retryButtonText}>Skúsiť znova</Text>
          </TouchableOpacity>
        )}

        {progress.completed > 0 && (
          <TouchableOpacity
            onPress={onClearCompleted}
            style={styles.clearButton}
          >
            <Text style={styles.clearButtonText}>Vyčistiť</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 100,
    left: 16,
    right: 16,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    borderLeftWidth: 4,
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 1000,
  },
  mainContent: {
    padding: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusText: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Expose-Bold',
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  progressText: {
    fontSize: 12,
    fontFamily: 'Expose-Medium',
    fontWeight: '500',
    color: COLORS.n6,
  },
  progressBarContainer: {
    height: 4,
    backgroundColor: COLORS.n4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 2,
  },
  actionButtons: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: COLORS.n4,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  retryButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: COLORS.error,
    borderRadius: 6,
    marginRight: 8,
  },
  retryButtonText: {
    color: COLORS.white,
    fontSize: 12,
    fontFamily: 'Expose-Bold',
    fontWeight: '600',
  },
  clearButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: COLORS.n6,
    borderRadius: 6,
  },
  clearButtonText: {
    color: COLORS.white,
    fontSize: 12,
    fontFamily: 'Expose-Bold',
    fontWeight: '600',
  },
});
